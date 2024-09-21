/**
 * address controller
 */

import {factories} from '@strapi/strapi'
import WebClient from 'web-client-starter'

export type PostOffice = {
  Name: string
  Description: string | null
  BranchType: string
  DeliveryStatus: string
  Circle: string
  District: string
  Division: string
  Region: string
  Block: string
  State: string
  Country: string
  Pincode: string
}
export type AddressResponse = Array<{PostOffice: PostOffice[]; Status: string}>

export default factories.createCoreController('api::address.address', ({strapi}) => ({
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in to add an address')
    }
    const addressService = strapi.service('api::address.address')
    try {
      return addressService.createAddress(ctx.request.body.data, ctx.state.user.id)
    } catch (error) {
      ctx.throw(error)
    }
  },
  async find(ctx) {
    return await strapi.entityService.findMany('api::address.address', {filters: {user: ctx.state.user.id}})
  },

  async getAddress(ctx) {
    const {pinCode} = ctx.request.query

    if (!pinCode || typeof pinCode !== 'string') {
      ctx.throw('Pincode is required')
      return
    }

    try {
      const response = await WebClient.get<AddressResponse>({
        baseUrl: 'https://api.postalpincode.in',
        path: '/pincode/{pinCode}',
        uriVariables: {pinCode}
      })

      if (response[0].Status === 'Success') {
        const {PostOffice} = response[0]
        const {District, State, Block, Pincode} = PostOffice[0]
        return {
          city: Block,
          district: District,
          state: State,
          pinCode: +Pincode
        }
      } else {
        ctx.errors.badRequest({error: 'Invalid Pin Code'})
      }
    } catch (error) {
      ctx.errors.internalServerError({error: 'Internal Server Error'})
    }
  }
}))
