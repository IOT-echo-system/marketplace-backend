/**
 * address service
 */

import {factories} from '@strapi/strapi'
import type {AddressAddress} from '../../../../types/generated/components'

export default factories.createCoreService('api::address.address', ({strapi}) => ({
  createAddress(data: AddressAddress, userId: number) {
    return super.create({data: {...data, user: userId}})
  }
}))
