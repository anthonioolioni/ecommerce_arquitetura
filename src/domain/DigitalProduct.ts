import { Product } from './IProduct';

export class DigitalProduct implements Product {
  constructor(public id: number, public name: string, public price: number) {}

  // Produtos digitais não têm frete
  calculateFreight(): number {
    return 0;
  }
}
