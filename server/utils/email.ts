export function generateInvoiceEmail(customerId: string): string {
  return `invoices+${customerId}@senvo.de`;
}
