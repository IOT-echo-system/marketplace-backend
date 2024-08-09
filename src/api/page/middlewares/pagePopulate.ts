import type {Strapi} from '@strapi/strapi'

const populate = {
  header: {
    populate: {
      'hero-banner': '*'
    }
  },
  carousel: {
    populate: {
      cta: '*',
      image: '*',
      mobileImage: '*'
    }
  },
  content: {
    populate: '*'
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
    strapi.log.info('In pagePopulate middleware.')
    ctx.query = {
      populate,
      ...ctx.query
    }
    await next()
  }
}
