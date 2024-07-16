import {factories} from '@strapi/strapi';
import Razorpay from 'razorpay';
import crypto from 'crypto';


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export default factories.createCoreController('api::payment.payment', ({strapi}) => ({
  createOrder: async function (ctx) {
    const {amount, orderId} = ctx.request.body;
    const options = {amount: amount * 100, currency: 'INR', receipt: `payment-${orderId}`};
    const paymentService = strapi.service('api::payment.payment');

    try {
      const paymentOrder = await razorpay.orders.create(options);
      await paymentService.createPayment(paymentOrder, orderId, ctx)
      ctx.send(paymentOrder);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async verifyPayment(ctx) {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = ctx.request.body;
    const paymentService = strapi.service('api::payment.payment');
    await paymentService.updateVerify(ctx.request.body)

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    if (generated_signature === razorpay_signature) {
      const order = await paymentService.updatePaymentSuccess(payment)
      ctx.send({status: 'success', order});
    } else {
      await paymentService.updatePaymentFailed(payment)
      ctx.send({status: 'failure', message: 'Payment verification failed'});
    }
  },
}));
