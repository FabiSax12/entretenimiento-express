import type { ContractRequest } from "@/core/domain/entities";
import type { ContractRequestRepository } from "@/core/domain/repositories/ContractRequestRepository";

export class InMemoryContractRequestRepository implements ContractRequestRepository {
  private contractRequests: Map<string, ContractRequest> = new Map();

  async getAll(): Promise<ContractRequest[]> {
    return Array.from(this.contractRequests.values());
  }

  async getById(contractRequestId: string): Promise<ContractRequest | undefined> {

    return this.contractRequests.get(contractRequestId);
  }

  async create(contractRequest: ContractRequest): Promise<ContractRequest> {
    if (this.contractRequests.has(contractRequest.id)) {
      throw new Error(`ContractRequest with ID ${contractRequest.id} already exists.`);
    }
    this.contractRequests.set(contractRequest.id, contractRequest);
    return contractRequest;
  }

  async update(contractRequest: ContractRequest): Promise<ContractRequest | undefined> {
    if (!this.contractRequests.has(contractRequest.id)) {
      throw new Error(`ContractRequest with ID ${contractRequest.id} does not exist.`);
    }
    this.contractRequests.set(contractRequest.id, contractRequest);
    return contractRequest;
  }

  async delete(contractRequestId: string): Promise<void> {
    if (!this.contractRequests.has(contractRequestId)) {
      throw new Error(`ContractRequest with ID ${contractRequestId} does not exist.`);
    }
    this.contractRequests.delete(contractRequestId);
  }

  async getByClientId(clientId: string): Promise<ContractRequest[]> {
    console.log(this.contractRequests)
    return Array.from(this.contractRequests.values()).filter(cr => cr.clientId === clientId);
  }

  async getByProviderId(providerId: string): Promise<ContractRequest[]> {
    return Array.from(this.contractRequests.values()).filter(cr => cr.providerId === providerId);
  }
}