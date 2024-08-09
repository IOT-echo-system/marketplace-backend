import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::payment.payment', ({strapi}) => ({
  async verifyPayment(ctx) {
    const paymentService = strapi.service('api::payment.payment')
    return await paymentService.updateVerify(ctx.request.body)
  }
}))
