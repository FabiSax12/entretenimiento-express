import type { Client, Contract, ContractRequest } from "@/core/domain/entities";

export interface IClientRepository {
  getById(id: string): Promise<Client | undefined>;
  getContracts(clientId: string): Promise<Contract[]>;
  createContractRequest(request: ContractRequest): Promise<ContractRequest>;
  updateProfile(clientId: string, updates: Partial<Client>): Promise<Client | undefined>;
}