import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({strapi}) => ({
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in to create an order');
    }
    const orderService = strapi.service('api::order.order');
    try {
      return orderService.createOrder(ctx.request.body.data, ctx.state.user.id)
    } catch (error) {
      ctx.throw(error)
    }
  },

  async find(ctx, next) {
    ctx.query = {
      ...ctx.query,
      filters: {user: ctx.state.user.id},
      sort: ['createdAt:desc'],
      populate: {
        shippingAddress: '*',
        billingAddress: '*',
        products: '*',
      },
    }
    return strapi.entityService.findMany('api::order.order', ctx.query)
  }
}));
