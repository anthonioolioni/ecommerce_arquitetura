export interface IOrderRepository {
  findProductById(id: number): Promise<any | null>;
  createOrder(data: { customer: string; items: string; total: number; status: string }): Promise<{ id: number }>;
}
