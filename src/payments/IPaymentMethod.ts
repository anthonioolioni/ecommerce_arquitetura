export interface IPaymentMethod {
  process(details: any): void;
}
