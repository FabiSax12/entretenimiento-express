import type { ContractRequest } from "../entities";

export interface ContractRequestRepository {
  create(contractRequest: ContractRequest): Promise<ContractRequest>;
  getById(id: string): Promise<ContractRequest | undefined>;
  getByClientId(clientId: string): Promise<ContractRequest[]>;
  getByProviderId(providerId: string): Promise<ContractRequest[]>;
  getAll(): Promise<ContractRequest[]>;
  update(contractRequest: ContractRequest): Promise<ContractRequest | undefined>;
  delete(id: string): Promise<void>;
}