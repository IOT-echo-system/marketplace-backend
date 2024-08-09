import Webclient from './webclient'
import {shippingConfig} from '../config'
import type {AddressAddress} from '../../../../types/generated/components'
import type {EstimateDeliveryResponse} from './type/shipping'

type StoreLocation = {location: AddressAddress['attributes']}

const ShippingHelperService = ({strapi}) => ({
  async estimateDelivery(pinCode: string) {
    const {location}: StoreLocation = await strapi
      .query('api::store-location.store-location')
      .findOne({populate: {location: '*'}})
    return Webclient.post<EstimateDeliveryResponse>({
      baseUrl: shippingConfig.baseUrl,
      path: shippingConfig.estimateDelivery,
      body: {
        data: {
          from_pincode: `${location.pinCode}`,
          to_pincode: pinCode,
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
})

export default ShippingHelperService
