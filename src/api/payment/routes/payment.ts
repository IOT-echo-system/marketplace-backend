export default {
  routes: [
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
