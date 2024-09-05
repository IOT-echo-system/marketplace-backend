export default {
  routes: [
    {
      method: 'POST',
      path: '/seller/orders/filter',
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
    },
    {
      method: 'PUT',
      path: '/seller/orders/:orderId',
      handler: 'seller.markAsDelivered',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/seller/orders',
      handler: 'seller.createOrder',
      config: {
        policies: []
      }
    }
  ]
}
