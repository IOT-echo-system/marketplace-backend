/**
 * main-menu service
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreService('api::main-menu.main-menu', ({strapi}) => ({
  async findMenus() {
    const menuItem = await strapi.query('api::main-menu.main-menu').findOne({populate: ['categories']})
    const findChildren = async (categoryId: string, depth: number) => {
      const children = await strapi.query('api::category.category').findMany({where: {parent: categoryId}})
      if (depth === 0) {
        return children
      }
      return await Promise.all(
        children.map(async child => ({
          ...child,
          children: await findChildren(child.id, depth - 1)
        }))
      )
    }
    return await Promise.all(
      menuItem.categories.map(async category => ({
        ...category,
        children: await findChildren(category.id, 1)
      }))
    )
  }
}))
