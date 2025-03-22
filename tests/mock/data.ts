export type Order = {
  customerName: string
  items: string[]
  total: number
}

export const order: Order = {
  customerName: 'John Doe',
  items: ['Book', 'Pen'],
  total: 25.0
}
