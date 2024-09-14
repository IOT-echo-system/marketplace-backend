import {factories} from '@strapi/strapi'
import {OrderRequest} from './types/order'

export default factories.createCoreService('api::order.order', ({strapi}) => ({
  async createOrder(ctx) {
    const data: OrderRequest = ctx.request.body
    const productsWithQty = await strapi.service('api::product.product').getProductsWithQty(data.productIds)
    const {amount, qty} = productsWithQty.reduce(({amount, qty}, product) => {
      return {amount: amount + product.price * product.qty, qty: qty + product.qty}
    }, {amount: 0, qty: 0})


    ctx.query = {filters: {code: data.discountCoupon?.code ?? ''}}
    const discountCoupon = await strapi.controller('api::discount-coupon.discount-coupon').find(ctx, {})

    const amountAfterDiscount = amount - (amount * (discountCoupon[0]?.discount ?? 0)) / 100
    const shippingCharge = (data.type === 'ONLINE' && amountAfterDiscount < +(process.env.FREE_DELIVERY_THRESHOLD ?? 2000)) ? 99 : 0
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
        state: data.paymentMode === 'RAZORPAY' ? 'ORDER_NOT_PLACED' : 'PLACED',
        products: productsWithQty,
        user: ctx.state.user.id,
        amount: amountAfterDiscount * 1.18 + shippingCharge,
        qty,
        discountCoupon: discountCoupon[0] ? {
          ...discountCoupon[0],
          amount: amount * (discountCoupon[0].discount ?? 0)
        } : null,
        shipping: shipping?.id
      }
    })

    const paymentResponse = await strapi.service('api::payment.payment').initiatePayment(order.id, order.amount, data.paymentMode)
    await super.update(order.id, {data: {payment: paymentResponse.id}})
    return {order, payment: paymentResponse.paymentOrder}
  },

  async createSellerOrder(ctx) {
    const data = ctx.request.body.cart
    const {amount, qty} = data.products.reduce(({amount, qty}, product) => {
      return {amount: amount + product.price * product.qty, qty: qty + product.qty}
    }, {amount: 0, qty: 0})
    const order = await super.create({
      data: {
        billingAddress: data.billingAddress,
        state: ctx.request.body.mode === 'CASH' ? 'PLACED' : 'ORDER_NOT_PLACED',
        products: data.products,
        amount: amount * (data.gstBill ? 1.18 : 1),
        qty,
        discountCoupon: data.discount,
        shippingCharge: 0,
        type: 'SELLER'
      }
    })
    const paymentService = strapi.service('api::payment.payment')
    const paymentResponse = await paymentService.initiatePayment(order.id, order.amount, ctx.request.body.mode)
    return await super.update(order.id, {data: {payment: paymentResponse.id}})
  },

  async updateAsCashCollected(ctx) {
    const order = await strapi.query('api::order.order').findOne(ctx.request.params.orderId)
    strapi.query('api::order.order').update({
      where: {id: ctx.request.params.orderId},
      data: {state: 'DELIVERED', discount: {amount: order.discount.amount}}
    })
    const paymentService = strapi.service('api::payment.payment')
    const paymentResponse = await paymentService.initiatePayment(order.id, order.amount, ctx.request.body.mode)
    return await super.update(order.id, {data: {payment: paymentResponse.id}})
  }
}))
