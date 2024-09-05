/**
 * address-by-seller controller
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::address-by-seller.address-by-seller', ({strapi}) => ({
  createAddress(ctx) {
    return strapi.service('api::address-by-seller.address-by-seller').createAddress(ctx)
  }
}))
