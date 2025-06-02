import { Provider } from "@/core/domain/entities/Provider";
import { PortfolioItem } from "@/core/domain/entities/PortfolioItem";
import { Service } from "@/core/domain/entities/Service";
import { ContractRequest } from "@/core/domain/entities/ContractRequest";
import { Review } from "@/core/domain/entities/Review";
import type { Portfolio } from "@/core/domain/entities";

export interface IProviderRepository {
  findById(id: string): Promise<Provider | undefined>;
  save(provider: Provider): Promise<void>;
  findByCriteria(criteria: any): Promise<Provider[]>;

  // Methods for managing the Provider's Portfolio
  getPortfolioByProviderId(providerId: string): Promise<Portfolio | undefined>;
  addPortfolioItem(item: PortfolioItem): Promise<void>;
  updatePortfolioItem(item: PortfolioItem): Promise<void>;
  deletePortfolioItem(itemId: string): Promise<void>;
  getPortfolioItemById(itemId: string): Promise<PortfolioItem | undefined>;


  // Methods for managing the Provider's Services
  getServicesByProviderId(providerId: string): Promise<Service[]>;
  getServiceById(serviceId: string): Promise<Service | undefined>;
  addService(service: Service): Promise<void>;
  updateService(service: Service): Promise<void>;
  deleteService(serviceId: string): Promise<void>;

  // Methods for managing Contract Requests received by the Provider
  getContractRequestsByProviderId(providerId: string): Promise<ContractRequest[]>;
  getContractRequestById(requestId: string): Promise<ContractRequest | undefined>;
  updateContractRequestStatus(requestId: string, status: 'Accepted' | 'Rejected' | 'Expired'): Promise<void>;
  // Potentially methods for adding response messages

  // Methods for managing Reviews received by the Provider
  getReviewsByProviderId(providerId: string): Promise<Review[]>;
}