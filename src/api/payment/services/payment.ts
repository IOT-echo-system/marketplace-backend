import {factories} from '@strapi/strapi'
import Razorpay from 'razorpay'
import crypto from 'crypto'

type PaymentOrder = {id: string}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export default factories.createCoreService('api::payment.payment', ({strapi}) => ({
  async initiatePayment(orderId: number, amount: number) {
    const options = {amount: Math.floor(amount * 100), currency: 'INR', receipt: `payment-${orderId}`}
    try {

      const paymentOrder = await razorpay.orders.create(options)
      console.log(paymentOrder)
      return super.create({
        data: {
          order: orderId,
          paymentOrder: paymentOrder,
          orderId: paymentOrder.id,
          status: 'CREATED'
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
  }
}))
