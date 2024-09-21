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
    },
    {
      method: 'PUT',
      path: '/seller/orders/:orderId/pay-and-deliver',
      handler: 'seller.payAndDeliver',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/seller/orders/:orderId/verify-payment',
      handler: 'seller.verifyPayment',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/seller/orders/:orderId/payment-status',
      handler: 'seller.paymentStatus',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/seller/products',
      handler: 'seller.getProducts',
      config: {
        policies: []
      }
    }
  ]
}
