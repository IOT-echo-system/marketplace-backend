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
    }
  ]
}
