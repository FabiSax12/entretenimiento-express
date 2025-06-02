// src/core/infrastructure/repositories/MockProviderRepository.ts

import { MockDataStore } from '../data/MockDataStore';
import { Provider } from '@/core/domain/entities/Provider';
import { Service } from '@/core/domain/entities/Service';
import { ContractRequest } from '@/core/domain/entities/ContractRequest';
import { Review } from '@/core/domain/entities/Review';

export class MockProviderRepository implements IProviderRepository {
  private dataStore = MockDataStore.getInstance();

  async getById(id: string): Promise<Provider | undefined> {
    return this.dataStore.getProviderById(id);
  }

  async getByCategory(category: string): Promise<Provider[]> {
    return this.dataStore.getProvidersByCategory(category);
  }

  async search(query: string, filters?: SearchFilters): Promise<Provider[]> {
    return this.dataStore.searchProviders(query, filters);
  }

  async getServices(providerId: string): Promise<Service[]> {
    return this.dataStore.getServicesByProvider(providerId);
  }

  async getContractRequests(providerId: string): Promise<ContractRequest[]> {
    return this.dataStore.getContractRequestsByProvider(providerId);
  }

  async getReviews(providerId: string): Promise<Review[]> {
    return this.dataStore.getReviewsByProvider(providerId);
  }

  async updateProfile(providerId: string, updates: Partial<Provider>): Promise<Provider | undefined> {
    const provider = await this.getById(providerId);
    if (!provider) return undefined;

    // Simular actualización
    Object.assign(provider, updates);
    return provider;
  }
}

// =============================================
// Mock Client Repository
// =============================================

import { Client } from '@/core/domain/entities/Client';
import { Contract } from '@/core/domain/entities/Contract';

export class MockClientRepository implements IClientRepository {
  private dataStore = MockDataStore.getInstance();

  async getById(id: string): Promise<Client | undefined> {
    return this.dataStore.getClientById(id);
  }

  async getContracts(clientId: string): Promise<Contract[]> {
    return this.dataStore.getContractsByClient(clientId);
  }

  async createContractRequest(request: ContractRequest): Promise<ContractRequest> {
    return this.dataStore.createContractRequest(request);
  }

  async updateProfile(clientId: string, updates: Partial<Client>): Promise<Client | undefined> {
    const client = await this.getById(clientId);
    if (!client) return undefined;

    Object.assign(client, updates);
    return client;
  }
}

// =============================================
// Mock Contract Service
// =============================================

import { Payment } from '@/core/domain/entities/Payment';
import type { IProviderRepository, SearchFilters } from '@/core/application/ports/IProviderRepository';
import type { IClientRepository } from '@/core/application/ports/IClientRepository';
import type { IContractService } from '@/core/application/ports/IContractService';
import type { IReviewService } from '@/core/application/ports/IReviewService';

export class MockContractService implements IContractService {
  private dataStore = MockDataStore.getInstance();

  async getById(id: string): Promise<Contract | undefined> {
    return this.dataStore.getContractById(id);
  }

  async createFromRequest(requestId: string, agreedPrice: number): Promise<Contract> {
    // Simular creación de contrato desde solicitud
    const newContract = new Contract(
      `contract-${Date.now()}`,
      "client-id", // En una app real, esto vendría de la request
      "provider-id",
      "service-id",
      new Date(),
      agreedPrice,
      "Confirmed",
      new Date(),
      requestId,
      `event-${Date.now()}`
    );

    return this.dataStore.createContract(newContract);
  }

  async updateStatus(contractId: string, status: Contract['status']): Promise<Contract | undefined> {
    return this.dataStore.updateContractStatus(contractId, status);
  }

  async addPayment(contractId: string, payment: Payment): Promise<Contract | undefined> {
    const contract = await this.getById(contractId);
    if (contract) {
      contract.payments.push(payment);
    }
    return contract;
  }

  async getPayments(contractId: string): Promise<Payment[]> {
    const contract = await this.getById(contractId);
    return contract?.payments || [];
  }
}

// =============================================
// Mock Review Service
// =============================================
export class MockReviewService implements IReviewService {
  private dataStore = MockDataStore.getInstance();

  async createReview(review: Review): Promise<Review> {
    return this.dataStore.createReview(review);
  }

  async getByProvider(providerId: string): Promise<Review[]> {
    return this.dataStore.getReviewsByProvider(providerId);
  }

  async getByContract(contractId: string): Promise<Review | undefined> {
    const contract = await this.dataStore.getContractById(contractId);
    return contract?.review;
  }

  async updateVisibility(reviewId: string, isVisible: boolean): Promise<Review | undefined> {
    // En el mock, simulamos encontrar y actualizar la review
    await new Promise(resolve => setTimeout(resolve, 200));
    // Lógica de actualización simulada
    return undefined;
  }
}

// =============================================
// Factory para crear datos de prueba
// =============================================

export class MockDataFactory {
  private static requestCounter = 1000;
  private static contractCounter = 2000;
  private static reviewCounter = 3000;

  static createContractRequest(
    clientId: string,
    providerId: string,
    serviceId: string,
    eventDate: Date,
    eventLocation: string,
    eventType: string,
    eventTime?: string,
    clientMessage?: string
  ): ContractRequest {
    return new ContractRequest(
      `request-${this.requestCounter++}`,
      clientId,
      providerId,
      serviceId,
      eventDate,
      eventLocation,
      eventType,
      'Pending',
      new Date(),
      eventTime,
      clientMessage
    );
  }

  static createContract(
    clientId: string,
    providerId: string,
    serviceId: string,
    eventDate: Date,
    agreedPrice: number,
    originalRequestId?: string
  ): Contract {
    return new Contract(
      `contract-${this.contractCounter++}`,
      clientId,
      providerId,
      serviceId,
      eventDate,
      agreedPrice,
      'Confirmed',
      new Date(),
      originalRequestId,
      `event-${this.contractCounter}`
    );
  }

  static createReview(
    clientId: string,
    contractId: string,
    rating: number,
    comment: string,
    providerId?: string,
    serviceId?: string
  ): Review {
    return new Review(
      `review-${this.reviewCounter++}`,
      clientId,
      contractId,
      rating,
      comment,
      new Date(),
      true,
      providerId,
      serviceId
    );
  }

  static createPayment(
    contractId: string,
    amount: number,
    currency: string = 'CRC',
    status: Payment['status'] = 'Pending'
  ): Payment {
    return new Payment(
      `payment-${Date.now()}`,
      contractId,
      amount,
      currency,
      new Date(),
      status,
      `txn-${Date.now()}`
    );
  }
}

// =============================================
// Hook personalizado para usar en React
// =============================================

export class MockAppService {
  private providerRepo = new MockProviderRepository();
  private clientRepo = new MockClientRepository();
  private contractService = new MockContractService();
  private reviewService = new MockReviewService();
  private dataStore = MockDataStore.getInstance();

  // Provider operations
  async getProvider(id: string) {
    return this.providerRepo.getById(id);
  }

  async searchProviders(query: string, filters?: SearchFilters) {
    return this.providerRepo.search(query, filters);
  }

  async getProvidersByCategory(category: string) {
    return this.providerRepo.getByCategory(category);
  }

  // Client operations
  async getClient(id: string) {
    return this.clientRepo.getById(id);
  }

  async getClientContracts(clientId: string) {
    return this.clientRepo.getContracts(clientId);
  }

  // Contract operations
  async createContractRequest(
    clientId: string,
    providerId: string,
    serviceId: string,
    eventDate: Date,
    eventLocation: string,
    eventType: string,
    eventTime?: string,
    clientMessage?: string
  ) {
    const request = MockDataFactory.createContractRequest(
      clientId,
      providerId,
      serviceId,
      eventDate,
      eventLocation,
      eventType,
      eventTime,
      clientMessage
    );

    return this.clientRepo.createContractRequest(request);
  }

  async respondToContractRequest(
    requestId: string,
    response: 'Accepted' | 'Rejected',
    message?: string
  ) {
    return this.dataStore.updateContractRequestStatus(requestId, response, message);
  }

  async createContractFromRequest(requestId: string, agreedPrice: number) {
    return this.contractService.createFromRequest(requestId, agreedPrice);
  }

  // Review operations
  async createReview(
    clientId: string,
    contractId: string,
    rating: number,
    comment: string,
    providerId?: string,
    serviceId?: string
  ) {
    const review = MockDataFactory.createReview(
      clientId,
      contractId,
      rating,
      comment,
      providerId,
      serviceId
    );

    return this.reviewService.createReview(review);
  }

  // Statistics
  getAppStatistics() {
    return this.dataStore.getStatistics();
  }

  // Utility
  resetData() {
    this.dataStore.reset();
  }
}

// Singleton instance for global use
export const mockAppService = new MockAppService();