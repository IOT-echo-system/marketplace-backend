/**
 * main-menu router
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreRouter('api::main-menu.main-menu', {
  config: {
    find: {
      middlewares: ['api::main-menu.main-menu-populate']
    }
  }
})
