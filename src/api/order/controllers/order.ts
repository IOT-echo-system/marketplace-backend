/**
 * order controller
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({strapi}) => ({
  async create(ctx) {
    ctx.request.body.data.user = ctx.state.user.id;
    return await super.create(ctx);
  },
  async find(ctx) {
    return await strapi.entityService.findMany('api::order.order', {filters: {user: ctx.state.user.id}});
  },
}));
