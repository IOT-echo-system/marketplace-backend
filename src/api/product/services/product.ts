import {factories} from '@strapi/strapi'
import {ProductIdWithQty} from '../../order/services/types/order'
import {ProductWithQty} from './types/product'

export default factories.createCoreService('api::product.product', ({strapi}) => ({
  async getProductsWithQty(productIdsWithQty: ProductIdWithQty[]): Promise<ProductWithQty[]> {
    const productIds = productIdsWithQty.map(({productId}) => productId)
    const products = await super.find({
      filters: {productId: productIds},
      populate: {featuredImage: '*'},
      pagination: {pageSize: 10000, page: 1}
    })

    return productIdsWithQty.reduce((orderProducts, {productId, qty}) => {
      const product = products.results.find((product: {productId: string}) => product.productId === productId)
      return product ? orderProducts.concat({...product, qty}) : orderProducts
    }, [])
  },

  getProductsByNameOrId(nameOrId: string) {
    return strapi.query('api::product.product').findMany({
      where: {$or: [{productId: {$containsi: nameOrId}}, {title: {$containsi: nameOrId}}]},
      populate: {featuredImage: '*'},
      limit: 100
    })
  }
}))
