export type EstimateDeliveryResponse = {
  status: 'success' | 'error'
  status_code: number
  expected_delivery_date: string
}
