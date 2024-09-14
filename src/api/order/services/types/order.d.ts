import {AddressAddress, DiscountCouponDiscountCoupon} from '../../../../../types/generated/components'

export type ProductIdWithQty = {productId: string, qty: number}
export type OrderRequest = {
  productIds: ProductIdWithQty[],
  billingAddress: AddressAddress['attributes'],
  shippingAddress?: AddressAddress['attributes'],
  shippingCharge?: number,
  discountCoupon?: DiscountCouponDiscountCoupon['attributes'],
  type: 'ONLINE' | 'STORE_PICKUP',
  paymentMode: 'RAZORPAY' | 'CASH'
}
