import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({strapi}) => ({
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in to create an order')
    }
    try {
      return strapi.service('api::order.order').createOrder(ctx)
    } catch (error) {
      ctx.throw(error)
    }
  },

  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      filters: {...ctx.query.filters, user: ctx.state.user.id},
      sort: ['createdAt:desc'],
      populate: {
        shipping: {populate: {address: '*'}},
        billingAddress: '*',
        payment: {fields: ['status', 'mode', 'gst', 'amount', 'grandTotal'], populate: {discountCoupon: '*'}},
        products: {populate: {featuredImage: '*'}}
      }
    }
    return strapi.entityService.findMany('api::order.order', ctx.query)
  }
}))
