import {factories} from '@strapi/strapi'
import Webclient from './webclient'
import {EstimateDeliveryResponse} from './type/shipping'
import {shippingConfig} from '../config'

export default factories.createCoreService('api::shipping.shipping', ({strapi}) => ({
  async estimateDelivery(pincode: number) {
    const location = await strapi.service('api::store-location.store-location').find({populate: {location: '*'}})

    return Webclient.post<EstimateDeliveryResponse>({
      baseUrl: shippingConfig.baseUrl,
      path: shippingConfig.estimateDelivery,
      body: {
        data: {
          from_pincode: `${location.location?.pinCode}`,
          to_pincode: pincode,
          shipping_length_cms: '22',
          shipping_width_cms: '12',
          shipping_height_cms: '12',
          shipping_weight_kg: '0.5',
          order_type: 'forward',
          payment_method: 'prepaid',
          product_mrp: '1200.00'
        }
      }
    })
  }
}))
