export class Payment {
  id: string;
  contractId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  status: 'Pending' | 'Completed' | 'Failed';
  transactionId?: string;

  constructor(
    id: string,
    contractId: string,
    amount: number,
    currency: string,
    paymentDate: Date,
    status: 'Pending' | 'Completed' | 'Failed',
    transactionId?: string
  ) {
    this.id = id;
    this.contractId = contractId;
    this.amount = amount;
    this.currency = currency;
    this.paymentDate = paymentDate;
    this.status = status;
    this.transactionId = transactionId;
  }
}