import {factories} from '@strapi/strapi'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import {VerifyPaymentRequest} from './types/payment'
import {uuid4} from '@sentry/utils'
import {PaymentLinks} from 'razorpay/dist/types/paymentLink'

type PaymentOrder = {id: string}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export default factories.createCoreService('api::payment.payment', ({strapi}) => ({
  async createPayment(ctx) {
    const data = ctx.request.body
    ctx.query = {filters: {code: data.discountCoupon?.code ?? ''}}
    const discountCoupon = await strapi.controller('api::discount-coupon.discount-coupon').find(ctx, {})
    const discountAmount = (data.amount * (discountCoupon[0]?.discount ?? 0)) / 100
    const gst = ((data.gstBill ?? true) ? data.amount - discountAmount : 0) * 0.18
    return super.create({
      data: {
        amount: data.amount,
        discountCoupon: discountCoupon[0]
          ? {
              ...discountCoupon[0],
              amount: discountAmount
            }
          : null,
        gst,
        grandTotal: data.amount - discountAmount + gst,
        status: 'CREATED',
        mode: data.mode
      }
    })
  },

  async createPaymentBySeller(ctx) {
    const data = ctx.request.body
    const gst = ((data.cart.gstBill ?? true) ? data.amount - (data.cart.discount?.amount ?? 0) : 0) * 0.18
    return super.create({
      data: {
        amount: data.amount,
        discountCoupon: data.cart.discount,
        gst,
        grandTotal: data.amount - (data.cart.discount?.amount ?? 0) + gst,
        status: 'CREATED',
        mode: data.mode
      }
    })
  },

  async initiatePayment(paymentId: number, orderId: number, amount: number, paymentMode: 'CASH' | 'COD' | 'RAZORPAY') {
    const options = {amount: Math.floor(amount * 100), currency: 'INR', receipt: `payment-${orderId}`}
    try {
      const paymentOrder = await razorpay.orders.create(options)
      return strapi.query('api::payment.payment').update({
        where: {id: paymentId},
        data: {
          order: orderId,
          paymentOrder: paymentOrder,
          orderId: paymentOrder.id,
          status: 'CREATED',
          mode: paymentMode,
          grandTotal: amount
        }
      })
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
    }
  },

  async updateVerify(params: {razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string}) {
    await strapi.query('api::payment.payment').update({
      where: {orderId: params.razorpay_order_id},
      data: {verify: params, paymentId: params.razorpay_payment_id, status: 'ATTEMPT'}
    })
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(params.razorpay_order_id + '|' + params.razorpay_payment_id)
      .digest('hex')

    const payment = await razorpay.payments.fetch(params.razorpay_payment_id)
    if (generated_signature === params.razorpay_signature) {
      await this.updatePaymentSuccess(payment)
      return {status: 'success'}
    }
    await this.updatePaymentFailed(payment)
    return {status: 'failure', message: 'Payment verification failed'}
  },

  async updatePaymentSuccess(params: PaymentOrder) {
    await strapi.query('api::payment.payment').update({
      where: {paymentId: params.id},
      data: {finalState: params, status: 'SUCCESS'}
    })
    const payment = await strapi.query('api::payment.payment').findOne({
      where: {paymentId: params.id},
      populate: {order: '*'}
    })

    return strapi.query('api::order.order').update({
      where: {id: payment.order.id},
      data: {state: 'PLACED'}
    })
  },

  async updatePaymentFailed(params: PaymentOrder) {
    await strapi.query('api::payment.payment').update({
      where: {paymentId: params.id},
      data: {finalState: params, status: 'FAILED'}
    })
    const payment = await strapi.query('api::payment.payment').findOne({
      where: {paymentId: params.id},
      populate: {order: '*'}
    })

    return strapi.query('api::order.order').update({
      where: {id: payment.order.id},
      data: {state: 'PAYMENT_FAILED'}
    })
  },

  async createPaymentLink(orderId: string) {
    const order = await strapi.service('api::order.order').findOne(orderId, {
      populate: {billingAddress: '*', user: '*'}
    })
    try {
      const response = await razorpay.paymentLink.create({
        amount: Math.floor(order.amount * 100),
        upi_link: process.env.NODE_ENV === 'production',
        currency: 'INR',
        accept_partial: false,
        description: `Payment for Order ${orderId}`,
        reference_id: uuid4(),
        customer: {
          name: order.billingAddress.name,
          contact: `+91${order.billingAddress.mobileNo}`,
          email: order.user?.email
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: `${process.env.FRONTEND_URL}/profile/orders/${orderId}/payment`,
        callback_method: 'get'
      })
      return strapi.query('api::payment.payment').update({
        where: {order: orderId},
        data: {paymentOrder: response, paymentId: response.id, mode: 'RAZORPAY'}
      })
    } catch (error) {
      console.log(error, 'error')
    }
  },

  async verifyPaymentByLink(orderId: number, values: VerifyPaymentRequest) {
    const payment = await strapi.query('api::payment.payment').findOne({where: {order: orderId}})
    if (payment.paymentOrder.reference_id === values.razorpay_payment_link_reference_id) {
      const response = (await razorpay.paymentLink.fetch(payment.paymentLinkId)) as PaymentLinks.RazorpayPaymentLink & {
        order_id: string
      }
      await strapi.query('api::payment.payment').update({
        where: {order: orderId},
        data: {
          verify: values,
          finalState: response,
          orderId: response.order_id,
          paymentId: response.payments[0].payment_id,
          status: response.payments[0].status === 'captured' ? 'SUCCESS' : 'FAILURE'
        }
      })
      return response.payments[0].status === 'captured' ? 'SUCCESS' : 'FAILURE'
    }
    return 'FAILURE'
  },

  async updatePaymentStatus(orderId: number) {
    const payment = await strapi.query('api::payment.payment').findOne({where: {order: orderId}})
    const response = (await razorpay.paymentLink.fetch(payment.paymentOrder.id)) as PaymentLinks.RazorpayPaymentLink & {
      order_id: string
    }
    await strapi.query('api::payment.payment').update({
      where: {order: orderId},
      data: {
        finalState: response,
        orderId: response.order_id,
        paymentId: response.payments[0].payment_id,
        status: response.payments[0].status === 'captured' ? 'SUCCESS' : 'FAILURE'
      }
    })
  },

  async updateAsCashCollected(ctx) {
    const {amount} = ctx.request.body
    const payment = await strapi.query('api::payment.payment').findOne({
      where: {order: ctx.request.params.orderId},
      populate: {discountCoupon: '*'}
    })
    const discountAmount = (payment.grandTotal - amount) / 1.18
    const discountCoupon = payment.discountCoupon
      ? {...payment.discountCoupon, amount: discountAmount + payment.discountCoupon.amount}
      : {code: 'SELLER', discount: 0, amount: discountAmount}

    return await super.update(payment.id, {
      data: {
        status: 'SUCCESS',
        mode: 'CASH',
        collectedBy: ctx.state.user.id,
        discountCoupon,
        gst: (payment.amount - discountCoupon.amount) * 0.18,
        grandTotal: (payment.amount - discountCoupon.amount) * 1.18
      }
    })
  }
}))
