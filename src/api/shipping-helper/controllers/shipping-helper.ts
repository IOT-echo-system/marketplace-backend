/**
 * shipping controller
 */

import {factories} from '@strapi/strapi'
import ShippingHelperService from '../services/shipping'

export default factories.createCoreController('api::shipping.shipping', ({strapi}) => ({
  estimateDelivery(ctx) {
    const {pincode} = ctx.request.query
    if (!pincode) {
      return ctx.throws(new Error('pincode required!!'))
    }
    return ShippingHelperService({strapi}).estimateDelivery(pincode)
  },

  createOrder(ctx) {
    ShippingHelperService({strapi}).createOrder(ctx.request.body)
    return ""
  },
}))
