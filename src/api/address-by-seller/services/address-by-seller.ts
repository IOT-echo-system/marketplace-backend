/**
 * address-by-seller service
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreService('api::address-by-seller.address-by-seller', ({strapi}) => ({
  async createAddress(ctx) {
    const billingAddress = ctx.request.body.data
    const existingAddress = await strapi
      .query('api::address-by-seller.address-by-seller')
      .findOne({where: {mobileNo: billingAddress.mobileNo}})
    if (existingAddress) {
      return strapi.query('api::address-by-seller.address-by-seller').update({
        where: {mobileNo: billingAddress.mobileNo},
        data: billingAddress
      })
    }
    return super.create({data: billingAddress})
  }
}))
