import type { Contract, Payment } from "@/core/domain/entities";

export interface IContractService {
  getById(id: string): Promise<Contract | undefined>;
  createFromRequest(requestId: string, agreedPrice: number): Promise<Contract>;
  updateStatus(contractId: string, status: Contract['status']): Promise<Contract | undefined>;
  addPayment(contractId: string, payment: Payment): Promise<Contract | undefined>;
  getPayments(contractId: string): Promise<Payment[]>;
}