/**
 * address controller
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::address.address', ({strapi}) => ({
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in to add an address')
    }
    const addressService = strapi.service('api::address.address')
    try {
      return addressService.createAddress(ctx.request.body.data, ctx.state.user.id)
    } catch (error) {
      ctx.throw(error)
    }
  },
  async find(ctx) {
    return await strapi.entityService.findMany('api::address.address', {filters: {user: ctx.state.user.id}})
  }
}))
