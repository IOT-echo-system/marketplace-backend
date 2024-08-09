const SellerService = ({strapi}) => ({
  getAllOrders(ctx) {
    const {sort, filter, page} = ctx.request.body.data
    const validSorts = ['id', 'state']
    const validSortOrder = ['asc', 'desc']
    if (
      !validSorts.includes(sort.sortBy) ||
      !validSortOrder.includes(sort.order) ||
      ![...validSorts, ''].includes(filter.filterBy)
    ) {
      return ctx.badRequest('Bad request')
    }

    const query = {
      sort: [`${sort.sortBy}:${sort.order}`],
      filters: !filter.filterBy
        ? {}
        : {
            [filter.filterBy]: {
              $eq: filter.value
            }
          },
      pagination: {
        pageSize: 100,
        page: page
      }
    }
    return strapi.service('api::order.order').find(query)
  },

  getOrder(ctx) {
    return strapi.query('api::order.order').findOne({
      where: {id: ctx.request.params.orderId},
      populate: {
        products: '*',
        payment: '*',
        shippingAddress: '*',
        billingAddress: '*'
      }
    })
  }
})

export default SellerService
