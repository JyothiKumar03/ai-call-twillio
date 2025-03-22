import { order } from '~/mock/data'
import {
  calculate_tax,
  create_order_summary,
  process_payment,
  validate_order
} from '~/mock/fn'

// Integration test
describe('Order Processing Integration', () => {
  test('processes a valid order correctly', () => {
    // Step 1: Validate the order
    const isValid = validate_order(order)
    expect(isValid).toBe(true)

    // Step 2: Calculate tax
    const tax = calculate_tax(order.total)
    expect(tax).toBe(2.5)

    // Step 3: Process payment
    const paymentSuccessful = process_payment(order.total + tax)
    expect(paymentSuccessful).toBe(true)

    // Step 4: Create order summary
    const summary = create_order_summary(order, tax)
    expect(summary).toBe('Order for John Doe: $25 + $2.5 tax')
  })
})
