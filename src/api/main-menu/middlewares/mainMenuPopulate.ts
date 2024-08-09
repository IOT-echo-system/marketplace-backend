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
    strapi.log.info('In mainMenuPopulate middleware.')
    const mainMenuService = strapi.service('api::main-menu.main-menu')
    ctx.body = await mainMenuService.findMenus()
  }
}
