import type {Strapi} from '@strapi/strapi'

const populate = {
  header: {
    populate: ['image', 'mobileImage', 'cta']
  },
  mainContent: {
    populate: {
      cards: {
        populate: 'image'
      }
    }
  },
  ctaBanner: {
    populate: 'cta'
  },
  seo: {
    populate: ['metaImage']
  }
}

export default (config, {strapi}: {strapi: Strapi}) => {
  return async (ctx, next) => {
    const link = ctx.query.filters.link.$eq
    const categoryService = strapi.service('api::category.category')
    ctx.body = await categoryService.findTree(link)
  }
}
