import Webclient from './webclient'
import {shippingConfig} from '../config'
import type {AddressAddress} from '../../../../types/generated/components'
import {CreateOrderRequest, EstimateDeliveryResponse} from './type/shipping'

type StoreLocation = { location: AddressAddress['attributes'] }

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
  },

  async createOrder(values: CreateOrderRequest) {
    const order = await strapi.query('api::order.order').findOne({
      where: {id: values.orderId},
      populate: {billingAddress: '*', shippingAddress: '*', products: '*'}
    })
    const body = {
      data: {
        shipments: [{
          order: values.orderId,
          order_date: order.createdAt,
          total_amount: order.amount,
          name: order.shippingAddress.name,
          add: order.shippingAddress.address1,
          add2: order.shippingAddress.address2,
          add3: order.shippingAddress.address3,
          pin: order.shippingAddress.pinCode,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          phone: +order.shippingAddress.mobileNo,
          billing_name: order.billingAddress.name,
          billing_add: order.billingAddress.address1,
          billing_add2: order.billingAddress.address2,
          billing_add3: order.billingAddress.address3,
          billing_pin: order.billingAddress.pinCode,
          billing_city: order.billingAddress.city,
          billing_state: order.billingAddress.state,
          billing_phone: +order.billingAddress.mobileNo,
          products: order.products.map(product => ({
            product_name: product.title,
            product_quantity: product.qty,
            product_price: product.price,

          })),
          shipment_length: values.length,
          shipment_width: values.width,
          shipment_height: values.height,
          weight: values.weight,
          return_address_id: +process.env.shippingWarehouseAddressId,
          pickup_address_id: +process.env.shippingWarehouseAddressId,
          access_token: process.env.SHIPPING_ACCESS_TOKEN,
          secret_key: process.env.SHIPPING_SECRET_KEY
        }]
      }
    };
    const shipmentOrder = await Webclient.post({
      baseUrl: shippingConfig.baseUrl,
      path: shippingConfig.addOrder,
      body: body,
      skipLoggingRequestBody: true,
      skipLoggingResponseBody: true
    }).catch(console.error)
    console.log(order)
    console.log('-------------')
    console.log(JSON.stringify(body, null, 2))
    console.log('-------------')
    console.log(shipmentOrder)
  }
})

export default ShippingHelperService
