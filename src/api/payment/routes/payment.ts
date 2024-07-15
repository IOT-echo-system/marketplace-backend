export default {
  routes: [
    {
      method: 'POST',
      path: '/payments/order',
      handler: 'payment.createOrder',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payments/verify',
      handler: 'payment.verifyPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
