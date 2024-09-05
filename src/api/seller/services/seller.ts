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
      filters: {
        ...(!filter.filterBy || !filter.value
          ? {}
          : {[filter.filterBy]: {$eq: filter.value}}),
        ...(filter.type ? {type: filter.type} : {})
      },
      pagination: {pageSize: 100, page: page}
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
        billingAddress: '*',
        discountCoupon: '*'
      }
    })
  },

  async markAsDelivered(ctx) {
    return strapi.query('api::order.order').update({
      where: {id: ctx.request.params.orderId},
      data: {state: 'DELIVERED'}
    })
  },

  async createOrder(ctx) {
    const body = ctx.request.body
    ctx.request.body = {data: body.billingAddress}
    const address = await strapi.controller('api::address-by-seller.address-by-seller').createAddress(ctx)
    // await strapi.controller('api::order.order').create(ctx)
    return address
  }
})

export default SellerService
