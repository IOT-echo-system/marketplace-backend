import {factories} from '@strapi/strapi';

type PaymentOrder = { id: string }

export default factories.createCoreService('api::payment.payment', ({strapi}) => ({
  async createPayment(paymentOrder: PaymentOrder, orderId: string, ctx) {
    const order = await strapi.query('api::order.order').findOne({where: {id: orderId}})
    const payment = await super.create({
      data: {
        order: order.id,
        paymentOrder: JSON.parse(JSON.stringify(paymentOrder)),
        orderId: paymentOrder.id,
        status: 'CREATED'
      }
    })
    return strapi.query('api::order.order').update({where: {id: orderId}, data: {payment}})
  },

  updateVerify(params: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) {
    return strapi.query('api::payment.payment').update({
      where: {orderId: params.razorpay_order_id},
      data: {verify: params, paymentId: params.razorpay_payment_id, status: 'ATTEMPT'}
    })
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
