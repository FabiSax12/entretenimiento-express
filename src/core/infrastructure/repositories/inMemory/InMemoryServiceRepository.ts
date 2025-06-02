import { Service } from "@/core/domain/entities";
import type { ServiceRepository } from "@/core/domain/repositories/ServiceRepository";
import servicesJson from "@/core/infrastructure/data/Services.json";

export class InMemoryServiceRepository implements ServiceRepository {
  private services: Map<string, Service> = new Map();

  constructor() {
    servicesJson.forEach(serviceData => {
      const service = new Service(
        serviceData.id,
        serviceData.name,
        serviceData.description,
        serviceData.basePrice,
        serviceData.priceType as Service['priceType'],
        serviceData.providerId,
        serviceData.isActive,
        new Date(serviceData.createdAt),
        serviceData.categories,
        serviceData.portfolioItems,
        serviceData.estimatedDuration,
        serviceData.technicalRequirements
      );

      this.services.set(service.id, service);
    })
  }

  async getAll(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getById(serviceId: string): Promise<Service | undefined> {
    return this.services.get(serviceId);
  }

  async getByProviderId(providerId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.providerId === providerId);
  }

  async create(service: any): Promise<Service> {
    this.services.set(service.id, service);
    return service;
  }

  async update(service: any): Promise<Service | undefined> {
    if (!this.services.has(service.id)) {
      return undefined;
    }
    this.services.set(service.id, service);
    return service;
  }

  async delete(serviceId: string): Promise<void> {
    if (!this.services.has(serviceId)) {
      throw new Error(`Service with ID ${serviceId} does not exist.`);
    }
    this.services.delete(serviceId);
  }
}