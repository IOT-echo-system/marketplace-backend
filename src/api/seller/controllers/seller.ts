import SellerService from '../services/seller'

export default ({strapi}) => {
  const sellerService = SellerService({strapi})
  return {
    getAllOrders(ctx) {
      return sellerService.getAllOrders(ctx)
    },

    getOrder(ctx) {
      return sellerService.getOrder(ctx)
    }
  }
}
