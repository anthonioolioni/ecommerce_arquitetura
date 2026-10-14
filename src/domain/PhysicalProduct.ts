import { Product } from './IProduct';

export class PhysicalProduct implements Product {
  constructor(public id: number, public name: string, public price: number) {}

  // Frete fixo para produtos físicos
  calculateFreight(): number {
    return 10;
  }
}
