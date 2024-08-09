/**
 * category service
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreService('api::category.category', ({strapi}) => ({
  async findTree(link: string) {
    const category = await strapi.query('api::category.category').findOne({where: {link}, populate: ['parent']})

    const findFullTree = async (tree: any) => {
      if (!tree.parent?.id) {
        return tree
      }
      const parentCategory = await strapi.query('api::category.category').findOne({
        where: {id: tree.parent.id},
        populate: ['parent']
      })

      const siblings = await strapi.query('api::category.category').findMany({where: {parent: tree.parent.id}})
      const category = {...parentCategory, children: siblings.map(sibling => (sibling.id === tree.id ? tree : sibling))}
      return await findFullTree(category)
    }

    const children = await strapi.query('api::category.category').findMany({where: {parent: category.id}})
    const rootCategories = await strapi.query('api::category.category').findMany({where: {parent: null}})
    const categoryWidthTree = await findFullTree({...category, children})
    return {
      category,
      tree: rootCategories.map(category => (category.id === categoryWidthTree.id ? categoryWidthTree : category))
    }
  }
}))
