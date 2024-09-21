import SellerService from '../services/seller'

export default ({strapi}) => {
  const sellerService = SellerService({strapi})
  return {
    getAllOrders(ctx) {
      return sellerService.getAllOrders(ctx)
    },

    getOrder(ctx) {
      return sellerService.getOrder(ctx)
    },

    async markAsDelivered(ctx) {
      try {
        return await sellerService.markAsDelivered(ctx)
      } catch (error) {
        ctx.throw(error.message)
      }
    },

    createOrder(ctx) {
      return sellerService.createOrder(ctx)
    },

    payAndDeliver(ctx) {
      return sellerService.payAndDeliver(ctx)
    },

    verifyPayment(ctx) {
      return sellerService.verifyPayment(ctx)
    },

    paymentStatus(ctx) {
      return sellerService.paymentStatus(ctx)
    },

    getProducts(ctx) {
      return sellerService.getProducts(ctx)
    }
  }
}
