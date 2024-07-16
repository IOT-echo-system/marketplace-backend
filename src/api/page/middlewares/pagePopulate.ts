import {Strapi} from '@strapi/strapi';

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

export default (config, {strapi}: { strapi: Strapi }) => {
  return async (ctx, next) => {
    strapi.log.info('In pagePopulate middleware.');
    ctx.query = {
      populate,
      ...ctx.query
    }
     await next();
  };
};
