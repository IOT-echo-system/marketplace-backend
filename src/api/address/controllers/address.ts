/**
 * address controller
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::address.address', ({strapi}) => ({
  async create(ctx) {
    ctx.request.body.data.user = ctx.state.user.id;
    return await super.create(ctx);
  },
  async find(ctx) {
    return await strapi.entityService.findMany('api::address.address', {filters: {user: ctx.state.user.id}});
  }
}));
