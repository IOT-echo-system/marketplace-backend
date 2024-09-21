import {factories} from '@strapi/strapi'
import {OrderRequest} from './types/order'

export default factories.createCoreService('api::order.order', ({strapi}) => ({
  async createOrder(ctx) {
    const data: OrderRequest = ctx.request.body
    const productsWithQty = await strapi.service('api::product.product').getProductsWithQty(data.productIds)
    const {amount, qty} = productsWithQty.reduce(
      ({amount, qty}, product) => {
        return {amount: amount + product.price * product.qty, qty: qty + product.qty}
      },
      {amount: 0, qty: 0}
    )

    ctx.request.body.amount = amount
    const payment = await strapi.service('api::payment.payment').createPayment(ctx)

    const shippingCharge =
      data.type === 'ONLINE' && payment.grandTotal < +(process.env.FREE_DELIVERY_THRESHOLD ?? 2000) ? 99 : 0
    let shipping = null
    if (data.type === 'ONLINE') {
      if (data.shippingAddress) {
        shipping = await strapi.service('api::shipping.shipping').create({
          data: {
            address: data.shippingAddress,
            charge: shippingCharge
          }
        })
      } else {
        return ctx.throw('Shipping address required!')
      }
    }

    const order = await super.create({
      data: {
        ...data,
        state: data.mode === 'RAZORPAY' ? 'ORDER_NOT_PLACED' : 'PLACED',
        products: productsWithQty,
        user: ctx.state.user.id,
        amount: payment.grandTotal + shippingCharge,
        qty,
        shipping: shipping?.id
      }
    })

    const paymentResponse = await strapi
      .service('api::payment.payment')
      .initiatePayment(payment.id, order.id, order.amount, data.mode)
    await super.update(order.id, {data: {payment: paymentResponse.id}})
    return {order, payment: paymentResponse.paymentOrder}
  },

  async createSellerOrder(ctx) {
    const data = ctx.request.body.cart
    const {amount, qty} = data.products.reduce(
      ({amount, qty}, product) => {
        return {amount: amount + product.price * product.qty, qty: qty + product.qty}
      },
      {amount: 0, qty: 0}
    )
    ctx.request.body.amount = amount
    const payment = await strapi.service('api::payment.payment').createPaymentBySeller(ctx)
    const order = await super.create({
      data: {
        billingAddress: data.billingAddress,
        state: 'PLACED',
        products: data.products,
        amount: payment.grandTotal,
        qty,
        type: 'SELLER',
        payment: payment.id
      }
    })
    await strapi.service('api::payment.payment').initiatePayment(payment.id, order.id, order.amount, data.mode)
    return order
  },

  async updateAsCashCollected(ctx) {
    const {amount} = ctx.request.body
    await strapi.service('api::payment.payment').updateAsCashCollected(ctx)

    return await strapi.query('api::order.order').update({
      where: {id: ctx.request.params.orderId},
      data: {state: 'DELIVERED', amount}
    })
  },

  async markAsDelivered(orderId: number) {
    const order = await strapi.service('api::order.order').findOne(orderId, {populate: {payment: '*'}})
    if (order.payment.status === 'SUCCESS') {
      return await strapi.service('api::order.order').update(orderId, {data: {state: 'DELIVERED'}})
    }
    throw new Error('Payment is not completed, please complete the payment first')
  }
}))
