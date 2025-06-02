import { Provider } from "@/core/domain/entities/Provider";
import { Service } from "@/core/domain/entities/Service";
import { ContractRequest } from "@/core/domain/entities/ContractRequest";
import { Review } from "@/core/domain/entities/Review";

export interface IProviderRepository {
  getById(id: string): Promise<Provider | undefined>;
  getByCategory(category: string): Promise<Provider[]>;
  search(query: string, filters?: SearchFilters): Promise<Provider[]>;
  getServices(providerId: string): Promise<Service[]>;
  getContractRequests(providerId: string): Promise<ContractRequest[]>;
  getReviews(providerId: string): Promise<Review[]>;
  updateProfile(providerId: string, updates: Partial<Provider>): Promise<Provider | undefined>;
}

export interface SearchFilters {
  categories?: string[];
  location?: string;
  priceRange?: { min: number; max: number };
}