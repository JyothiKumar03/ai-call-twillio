import { Order } from './data'

export const example = () => {
  return 'example'
}

// Simulated service functions
export const validate_order = (order: Order): boolean => {
  return order.items.length > 0 && order.total > 0
}

export const calculate_tax = (total: number): number => {
  return total * 0.1 // 10% tax
}

export const process_payment = (total: number): boolean => {
  return total <= 1000 // Simulate payment processing
}

export const create_order_summary = (order: Order, tax: number): string => {
  return `Order for ${order.customerName}: $${order.total} + $${tax} tax`
}
