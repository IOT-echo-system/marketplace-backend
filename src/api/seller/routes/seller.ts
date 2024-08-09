export default {
  routes: [
    {
      method: 'POST',
      path: '/seller/orders',
      handler: 'seller.getAllOrders',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/seller/orders/:orderId',
      handler: 'seller.getOrder',
      config: {
        policies: []
      }
    }
  ]
}
