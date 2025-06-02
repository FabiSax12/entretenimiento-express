import type { Service } from "../entities";

export interface ServiceRepository {
  getAll(): Promise<Service[]>;
  getById(serviceId: string): Promise<Service | undefined>;
  getByProviderId(providerId: string): Promise<Service[]>;
  create(service: Service): Promise<Service>;
  update(service: Service): Promise<Service | undefined>;
  delete(serviceId: string): Promise<void>;
}