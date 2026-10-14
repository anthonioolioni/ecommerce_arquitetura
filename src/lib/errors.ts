// Dados inválidos enviados pelo cliente (HTTP 400)
export class ValidationError extends Error {}

// Pagamento recusado (HTTP 402)
export class PaymentDeclinedError extends Error {}
