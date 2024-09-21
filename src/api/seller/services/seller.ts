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
        ...(!filter.filterBy || !filter.value ? {} : {[filter.filterBy]: {$eq: filter.value}}),
        ...(filter.type ? {type: filter.type} : {})
      },
      pagination: {pageSize: 100, page: page}
    }
    return strapi.service('api::order.order').find(query)
  },

  getOrder(ctx) {
    return strapi.service('api::order.order').findOne(ctx.request.params.orderId, {
      populate: {
        products: '*',
        payment: {populate: {discountCoupon: '*'}},
        shipping: {populate: {address: '*'}},
        billingAddress: '*'
      }
    })
  },

  async markAsDelivered(ctx) {
    return strapi.service('api::order.order').markAsDelivered(ctx.request.params.orderId)
  },

  async createOrder(ctx) {
    const order = await strapi.service('api::order.order').createSellerOrder(ctx)
    ctx.request.body.amount = order.amount
    ctx.request.params.orderId = order.id
    return await this.payAndDeliver(ctx)
  },

  async payAndDeliver(ctx) {
    const {mode} = ctx.request.body
    if (mode === 'CASH') {
      await strapi.service('api::order.order').updateAsCashCollected(ctx)
    }
    if (mode === 'RAZORPAY') {
      await strapi.service('api::payment.payment').createPaymentLink(ctx.request.params.orderId)
    }
    return this.getOrder(ctx)
  },

  async verifyPayment(ctx) {
    const paymentService = await strapi.service('api::payment.payment')
    return await paymentService.verifyPaymentByLink(ctx.request.params.orderId, ctx.request.body)
  },

  async paymentStatus(ctx) {
    await strapi.service('api::payment.payment').updatePaymentStatus(ctx.request.params.orderId)
    return this.getOrder(ctx)
  },

  getProducts(ctx) {
    return strapi.service('api::product.product').getProductsByNameOrId(ctx.request.query.nameOrId)
  }
})

export default SellerService
