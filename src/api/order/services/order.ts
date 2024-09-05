/**
 * order service
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreService('api::order.order', ({strapi}) => ({
  async createOrder(data: Record<string, any>, userId: number) {
    const productIds = data.productIds.map(({productId}) => productId)
    const products = await strapi.query('api::product.product').findMany({
      where: {productId: {$in: productIds}},
      populate: {featuredImage: '*'}
    })
    const productsWithQty = data.productIds.reduce((orderProducts, {productId, qty}) => {
      const product = products.find(product => product.productId === productId)
      return product ? orderProducts.concat({...product, qty}) : orderProducts
    }, [])

    const {amount, qty} = productsWithQty.reduce(
      ({amount, qty}, product) => {
        return {
          amount: amount + product.price * product.qty,
          qty: qty + product.qty
        }
      },
      {amount: 0, qty: 0}
    )
    const discountCoupon = await strapi.query('api::discount-coupon.discount-coupon').findOne({
      where: {code: data.discountCoupon?.code, active: true}
    })
    const amountAfterDiscount = amount - (amount * (discountCoupon?.discount ?? 0)) / 100
    const shippingCharge = (data.type === 'ONLINE' && amountAfterDiscount < +(process.env.FREE_DELIVERY_THRESHOLD ?? 2000)) ? 99 : 0
    const order = await super.create({
      data: {
        ...data,
        state: 'ORDER_NOT_PLACED',
        products: productsWithQty,
        user: userId,
        amount: amountAfterDiscount * 1.18 + shippingCharge,
        qty,
        discountCoupon,
        shippingCharge
      }
    })

    const paymentService = strapi.service('api::payment.payment')
    const paymentResponse = await paymentService.initiatePayment(order.id, order.amount)
    await super.update(order.id, {data: {payment: paymentResponse.id}})
    return paymentResponse.paymentOrder
  }
}))
