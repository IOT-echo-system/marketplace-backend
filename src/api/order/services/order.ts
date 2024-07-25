/**
 * order service
 */

import {factories} from '@strapi/strapi';

export default factories.createCoreService('api::order.order', ({strapi}) => ({
  async createOrder(data: Record<string, any>, userId: number) {
    const productIds = data.productIds.map(({productId}) => productId)
    const products = await strapi.query('api::product.product').findMany({
      where: {productId: {$in: productIds}},
      populate: {featuredImage: "*"}
    });
    const productsWithQty = data.productIds.reduce((orderProducts, {productId, qty}) => {
      const product = products.find(product => product.productId === productId)
      return product ? orderProducts.concat({...product, qty}) : orderProducts
    }, [])

    const amount = productsWithQty.reduce((amount, product) => amount + product.price * product.qty, 0);
    const discountCoupon = await strapi.query('api::discount-coupon.discount-coupon').findOne({
      where: {code: data.discountCoupon.code, active: true}
    });
    const amountAfterDiscount = amount - (amount * discountCoupon.discount / 100);
    const order = await super.create({
      data: {
        ...data,
        state: 'ORDER_NOT_PLACED',
        products: productsWithQty,
        user: userId,
        amount: (amountAfterDiscount * 1.18) + (amountAfterDiscount >= 2000 ? 0 : 99),
        discountCoupon,
        shippingCharge: amountAfterDiscount >= 2000 ? 0 : 99
      }
    });


    const paymentService = strapi.service('api::payment.payment');
    const paymentResponse = await paymentService.initiatePayment(order.id, order.amount)
    await super.update(order.id, {data: {payment: paymentResponse.id}})
    return paymentResponse.paymentOrder
  }
}));
