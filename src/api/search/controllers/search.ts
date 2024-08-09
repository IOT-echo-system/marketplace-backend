import {sanitizeEntity} from 'strapi-utils'

export default {
  async search(ctx) {
    const {query} = ctx.query

    if (!query) {
      return ctx.badRequest('Query parameter "query" is required')
    }

    const results = await strapi.query('api::product.product').findMany({
      where: {$or: [{title: {$containsi: query.toLowerCase()}}, {productId: {$containsi: query.toLowerCase()}}]},
      populate: {featuredImage: '*'},
      limit: 20
    })

    return results.map(result => {
      const entity = sanitizeEntity(result, {model: strapi.getModel('api::product.product')})
      return {
        id: entity.id,
        title: entity.title,
        productId: entity.productId,
        price: entity.price,
        mrp: entity.mrp,
        slug: entity.slug,
        featuredImage: entity.featuredImage
      }
    })
  }
}
