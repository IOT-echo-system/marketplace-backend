import {factories} from '@strapi/strapi'
import axios from "axios";

export default factories.createCoreController('api::order.order', ({strapi}) => ({
  async create(ctx) {
    const productIds = ctx.request.body.data.productIds.map(({productId}) => productId)
    const products = await strapi.entityService.findMany('api::product.product', {
      filters: {productId: {$eq: productIds}},
      populate: 'featuredImage'
    });
    const productsWithQty = ctx.request.body.data.productIds.reduce((orderProducts, {productId, qty}) => {
      const product = products.find(product => product.productId === productId)
      return product ? orderProducts.concat({...product, qty}) : orderProducts
    }, [])

    ctx.request.body.data.user = ctx.state.user.id;
    ctx.request.body.data.products = productsWithQty
    ctx.request.body.data.state = 'CREATED'
    ctx.request.body.data.amount = productsWithQty.reduce((amount, product) => amount + product.price * product.qty, 0);
    const {data} = await super.create(ctx);
    const body = {
      orderId: data.id,
      amount: data.attributes.amount
    };
    try {
      const paymentResponse = await axios.post(`http://${ctx.request.host}/api/payments/order`, body, {
        headers: {authorization: ctx.request.headers.authorization},
      })
      return paymentResponse.data
    } catch (error) {
      console.log(error.response.data)
      ctx.throw(error)
    }
  },
  async find(ctx) {
    return strapi.entityService.findMany('api::order.order', {
      filters: {user: ctx.state.user.id},
      populate: ['billingAddress', 'shippingAddress']
    });
  }
}));
