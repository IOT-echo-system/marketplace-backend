export type EstimateDeliveryResponse = {
  status: 'success' | 'error'
  status_code: number
  expected_delivery_date: string
}

export type CreateOrderRequest = { orderId: number, length: number, width: number, height: number, weight: number }
