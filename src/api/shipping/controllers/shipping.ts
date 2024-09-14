import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::shipping.shipping', ({strapi}) => ({
  estimateDelivery(ctx) {
    const {pincode} = ctx.request.query
    if (!pincode) {
      return ctx.throws(new Error('pincode required!!'))
    }
    return strapi.service('api::shipping.shipping').estimateDelivery(pincode)
  }
}))
