import type { Provider } from "../entities";

export interface ProviderRepository {
  getAll(): Promise<Provider[]>;
  getById(id: string): Promise<Provider | undefined>;
  create(provider: Provider): Promise<Provider>;
  update(provider: Provider): Promise<Provider | undefined>;
  delete(id: string): Promise<void>;
}