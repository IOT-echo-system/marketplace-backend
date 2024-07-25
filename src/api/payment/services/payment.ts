import {factories} from '@strapi/strapi';
import Razorpay from "razorpay";
import crypto from "crypto";

type PaymentOrder = { id: string }

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export default factories.createCoreService('api::payment.payment', ({strapi}) => ({
  async initiatePayment(orderId: number, amount: number) {
    const options = {amount: amount * 100, currency: 'INR', receipt: `payment-${orderId}`};
    const paymentOrder = await razorpay.orders.create(options);
    return super.create({
      data: {
        order: orderId,
        paymentOrder: paymentOrder,
        orderId: paymentOrder.id,
        status: 'CREATED'
      }
    });
  },

  async updateVerify(params: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) {
    await strapi.query('api::payment.payment').update({
      where: {orderId: params.razorpay_order_id},
      data: {verify: params, paymentId: params.razorpay_payment_id, status: 'ATTEMPT'}
    })
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(params.razorpay_order_id + "|" + params.razorpay_payment_id)
      .digest('hex');

    const payment = await razorpay.payments.fetch(params.razorpay_payment_id)
    if (generated_signature === params.razorpay_signature) {
      await this.updatePaymentSuccess(payment)
      return {status: 'success'}
    } else {
      await this.updatePaymentFailed(payment)
      return {status: 'failure', message: 'Payment verification failed'}
    }
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
}));
