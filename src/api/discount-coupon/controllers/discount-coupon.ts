/**
 * discount-coupon controller
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::discount-coupon.discount-coupon', ({strapi}) => ({
  find(ctx) {
    ctx.query = {
      ...ctx.query,
      filters: {...ctx.query.filters, active: true}
    }
    return strapi.entityService.findMany('api::discount-coupon.discount-coupon', ctx.query)
  }
}))
