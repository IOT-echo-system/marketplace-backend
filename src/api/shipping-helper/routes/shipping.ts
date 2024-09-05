/**
 * shipping router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/shipping/estimate-delivery',
      handler: 'shipping-helper.estimateDelivery',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/shipping/orders',
      handler: 'shipping-helper.createOrder',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
