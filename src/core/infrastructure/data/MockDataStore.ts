// src/core/infrastructure/data/MockDataStore.ts

import { User } from "@/core/domain/entities/User";
import { Provider } from "@/core/domain/entities/Provider";
import { Client } from "@/core/domain/entities/Client";
import { Service } from "@/core/domain/entities/Service";
import { Portfolio } from "@/core/domain/entities/Portfolio";
import { PortfolioItem } from "@/core/domain/entities/PortfolioItem";
import { ContractRequest } from "@/core/domain/entities/ContractRequest";
import { Contract } from "@/core/domain/entities/Contract";
import { Review } from "@/core/domain/entities/Review";
import { Payment } from "@/core/domain/entities/Payment";
import { PublicContact } from "@/core/domain/value-objects/PublicContact";

// =============================================
// MOCK DATA STORE - Simulación de Base de Datos
// =============================================

export class MockDataStore {
  private static instance: MockDataStore;

  // Tablas simuladas
  private users: Map<string, User> = new Map();
  private providers: Map<string, Provider> = new Map();
  private clients: Map<string, Client> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private portfolioItems: Map<string, PortfolioItem> = new Map();
  private services: Map<string, Service> = new Map();
  private contractRequests: Map<string, ContractRequest> = new Map();
  private contracts: Map<string, Contract> = new Map();
  private reviews: Map<string, Review> = new Map();
  private payments: Map<string, Payment> = new Map();

  private constructor() {
    this.seedData();
  }

  public static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore();
    }
    return MockDataStore.instance;
  }

  // =============================================
  // SEED DATA - Datos iniciales
  // =============================================
  private seedData(): void {
    // Crear usuarios base
    const user1 = new User("user-1", "djritmo@example.com", "hashedpass1", "Provider", new Date("2024-01-15"), new Date());
    const user2 = new User("user-2", "johndoe@example.com", "hashedpass2", "Client", new Date("2024-02-10"), new Date());
    const user3 = new User("user-3", "bandasonora@example.com", "hashedpass3", "Provider", new Date("2024-01-20"), new Date());
    const user4 = new User("user-4", "mariaperez@example.com", "hashedpass4", "Client", new Date("2024-03-05"), new Date());

    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);
    this.users.set(user4.id, user4);

    // Crear portfolios
    const portfolio1 = new Portfolio("portfolio-1", "provider-1", "Portfolio DJ Ritmo");
    const portfolio2 = new Portfolio("portfolio-2", "provider-2", "Portfolio Banda Sonora");

    this.portfolios.set(portfolio1.id, portfolio1);
    this.portfolios.set(portfolio2.id, portfolio2);

    // Crear proveedores
    const provider1 = new Provider(
      user1,
      "DJ Ritmo",
      "DJ profesional con más de 10 años de experiencia en eventos corporativos y fiestas privadas. Especializado en música latina, electrónica y pop internacional.",
      new PublicContact('djritmo@example.com', '+506 8888-8888'),
      ["DJ", "Música Electrónica", "Pop"],
      "San José, Costa Rica",
      portfolio1,
      [],
      [],
      [],
      true,
      "https://i.pravatar.cc/150?u=djritmo"
    );
    provider1.id = "provider-1";

    const provider2 = new Provider(
      user3,
      "Banda Sonora",
      "Grupo musical versátil con repertorio que abarca desde rock clásico hasta cumbia y merengue, ideal para fiestas y eventos.",
      new PublicContact('bandasonora@example.com', '+506 7777-7777'),
      ["Música en vivo", "Rock", "Música Tropical"],
      "Heredia, Costa Rica",
      portfolio2,
      [],
      [],
      [],
      true,
      "https://i.pravatar.cc/150?u=bandasonora"
    );
    provider2.id = "provider-2";

    this.providers.set(provider1.id, provider1);
    this.providers.set(provider2.id, provider2);

    // Crear clientes
    const client1 = new Client(user2, "John Doe Pérez", "+506 9999-9999");
    client1.id = "client-1";

    const client2 = new Client(user4, "María Pérez García", "+506 8888-9999");
    client2.id = "client-2";

    this.clients.set(client1.id, client1);
    this.clients.set(client2.id, client2);

    // Crear items de portfolio
    this.createPortfolioItems();

    // Crear servicios
    this.createServices();

    // Crear solicitudes de contrato
    this.createContractRequests();

    // Crear contratos
    this.createContracts();

    // Crear reseñas
    this.createReviews();

    // Crear pagos
    this.createPayments();

    // Establecer relaciones
    this.establishRelationships();
  }

  private createPortfolioItems(): void {
    const items = [
      new PortfolioItem("item-1", "portfolio-1", "Video", "Festival Verano 2023", "Actuación principal en el Festival de Verano en Playa Jacó", new Date("2023-03-15"), true, "https://example.com/video1.mp4"),
      new PortfolioItem("item-2", "portfolio-1", "Photo", "Evento Corporativo Tech Summit", "Música ambiental y DJ set para la gala de cierre", new Date("2023-05-22"), true, "https://example.com/photo1.jpg"),
      new PortfolioItem("item-3", "portfolio-1", "Audio", "Mix Tropical 2023", "Compilación de éxitos tropicales remixados", new Date("2023-06-10"), true, "https://example.com/audio1.mp3"),
      new PortfolioItem("item-4", "portfolio-1", "Description", "Propuesta para Eventos Corporativos", "Descripción detallada de servicios para eventos empresariales", new Date("2023-01-05"), true),
      new PortfolioItem("item-5", "portfolio-2", "Video", "Concierto Rock Nacional", "Presentación en vivo en el Teatro Nacional", new Date("2023-04-20"), true, "https://example.com/video2.mp4"),
      new PortfolioItem("item-6", "portfolio-2", "Photo", "Boda García-Morales", "Música en vivo para ceremonia y recepción", new Date("2023-08-15"), true, "https://example.com/photo2.jpg"),
    ];

    items.forEach(item => this.portfolioItems.set(item.id, item));
  }

  private createServices(): void {
    const services = [
      new Service(
        "service-1",
        "DJ para Eventos Corporativos",
        "Servicio completo de DJ para eventos empresariales, incluyendo música ambiental y animación profesional.",
        150000,
        "PerEvent",
        "provider-1",
        true,
        new Date("2024-01-15"),
        ["Corporativo", "DJ", "Música en vivo"],
        ["item-2", "item-4"],
        "2-4 horas",
        "Equipo de sonido profesional, conexión a internet estable"
      ),
      new Service(
        "service-2",
        "DJ para Fiestas Privadas",
        "Música personalizada y ambiente festivo para cumpleaños, aniversarios y otras celebraciones privadas.",
        100000,
        "PerEvent",
        "provider-1",
        true,
        new Date("2024-01-15"),
        ["Fiestas Privadas", "DJ", "Pop"],
        ["item-1", "item-3"],
        "3-6 horas",
        "Equipo de sonido básico, espacio para setup"
      ),
      new Service(
        "service-3",
        "Banda en Vivo - Rock",
        "Presentación musical en vivo con repertorio de rock clásico y moderno.",
        250000,
        "PerEvent",
        "provider-2",
        true,
        new Date("2024-01-20"),
        ["Música en vivo", "Rock", "Conciertos"],
        ["item-5"],
        "2-3 horas",
        "Escenario, equipo de sonido profesional, conexiones eléctricas"
      ),
      new Service(
        "service-4",
        "Música para Bodas",
        "Servicio musical completo para ceremonias y recepciones de boda.",
        180000,
        "PerEvent",
        "provider-2",
        true,
        new Date("2024-01-20"),
        ["Bodas", "Música en vivo", "Ceremonias"],
        ["item-6"],
        "4-6 horas",
        "Espacio cubierto, equipo de sonido"
      ),
    ];

    services.forEach(service => this.services.set(service.id, service));
  }

  private createContractRequests(): void {
    const requests = [
      new ContractRequest(
        "request-1",
        "client-1",
        "provider-1",
        "service-1",
        new Date("2025-07-15"),
        "San José, Hotel InterContinental",
        "Evento Corporativo",
        "Pending",
        new Date("2025-06-01"),
        "19:00",
        "Necesitamos DJ para gala de fin de año corporativo. Audiencia de 200 personas."
      ),
      new ContractRequest(
        "request-2",
        "client-2",
        "provider-2",
        "service-4",
        new Date("2025-08-20"),
        "Heredia, Quinta Los Girasoles",
        "Boda",
        "Pending",
        new Date("2025-05-15"),
        "16:00",
        "Boda al aire libre, necesitamos música para ceremonia y recepción."
      ),
      new ContractRequest(
        "request-3",
        "client-1",
        "provider-1",
        "service-2",
        new Date("2025-06-30"),
        "San José, Residencia Privada",
        "Cumpleaños",
        "Pending",
        new Date("2025-05-20"),
        "20:00",
        "Fiesta de cumpleaños 50 años, ambiente tropical."
      ),
    ];

    requests.forEach(request => this.contractRequests.set(request.id, request));
  }

  private createContracts(): void {
    const contracts = [
      new Contract(
        "contract-1",
        "client-2",
        "provider-2",
        "service-4",
        new Date("2025-08-20"),
        180000,
        "Confirmed",
        new Date("2025-05-16"),
        "request-2",
        "event-1"
      ),
    ];

    contracts.forEach(contract => this.contracts.set(contract.id, contract));
  }

  private createReviews(): void {
    const reviews = [
      new Review(
        "review-1",
        "client-2",
        "contract-1",
        5,
        "Excelente servicio, la banda fue increíble y todos los invitados quedaron encantados. Muy profesionales y puntuales.",
        new Date("2025-08-22"),
        true,
        "provider-2",
        "service-4"
      ),
    ];

    reviews.forEach(review => this.reviews.set(review.id, review));
  }

  private createPayments(): void {
    const payments = [
      new Payment(
        "payment-1",
        "contract-1",
        90000, // 50% adelanto
        "CRC",
        new Date("2025-05-17"),
        "Completed",
        "txn-12345"
      ),
      new Payment(
        "payment-2",
        "contract-1",
        90000, // 50% restante
        "CRC",
        new Date("2025-08-20"),
        "Completed",
        "txn-67890"
      ),
    ];

    payments.forEach(payment => this.payments.set(payment.id, payment));
  }

  private establishRelationships(): void {
    // Relacionar portfolio items con portfolios
    this.portfolioItems.forEach(item => {
      const portfolio = this.portfolios.get(item.portfolioId);
      if (portfolio) {
        portfolio.items.push(item);
      }
    });

    // Relacionar servicios con proveedores
    this.services.forEach(service => {
      const provider = this.providers.get(service.providerId);
      if (provider) {
        provider.services.push(service);
      }
    });

    // Relacionar solicitudes con proveedores
    this.contractRequests.forEach(request => {
      const provider = this.providers.get(request.providerId);
      if (provider) {
        provider.contractRequests.push(request);
      }
    });

    // Relacionar reseñas con proveedores
    this.reviews.forEach(review => {
      if (review.providerId) {
        const provider = this.providers.get(review.providerId);
        if (provider) {
          provider.reviews.push(review);
        }
      }
    });

    // Relacionar contratos con servicios
    this.contracts.forEach(contract => {
      const service = this.services.get(contract.serviceId);
      if (service) {
        service.contracts.push(contract);
      }
    });

    // Relacionar pagos con contratos
    this.payments.forEach(payment => {
      const contract = this.contracts.get(payment.contractId);
      if (contract) {
        contract.payments.push(payment);
      }
    });

    // Relacionar reseñas con contratos
    this.reviews.forEach(review => {
      const contract = this.contracts.get(review.contractId);
      if (contract) {
        contract.review = review;
      }
    });
  }

  // =============================================
  // MÉTODOS DE CONSULTA (READ)
  // =============================================

  async getProviderById(id: string): Promise<Provider | undefined> {
    await this.simulateNetworkDelay();
    console.log(`Fetching provider with ID: ${id}`);
    console.log(`Available providers: ${Array.from(this.providers.keys()).join(', ')}`);
    return this.providers.get(id);
  }

  async getClientById(id: string): Promise<Client | undefined> {
    await this.simulateNetworkDelay();
    return this.clients.get(id);
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    await this.simulateNetworkDelay();
    return this.services.get(id);
  }

  async getContractById(id: string): Promise<Contract | undefined> {
    await this.simulateNetworkDelay();
    return this.contracts.get(id);
  }

  async getProvidersByCategory(category: string): Promise<Provider[]> {
    await this.simulateNetworkDelay();
    return Array.from(this.providers.values()).filter(provider =>
      provider.categories.includes(category) && provider.isActive
    );
  }

  async getServicesByProvider(providerId: string): Promise<Service[]> {
    await this.simulateNetworkDelay();
    return Array.from(this.services.values()).filter(service =>
      service.providerId === providerId && service.isActive
    );
  }

  async getContractRequestsByProvider(providerId: string): Promise<ContractRequest[]> {
    await this.simulateNetworkDelay();
    return Array.from(this.contractRequests.values()).filter(request =>
      request.providerId === providerId
    );
  }

  async getContractsByClient(clientId: string): Promise<Contract[]> {
    await this.simulateNetworkDelay();
    return Array.from(this.contracts.values()).filter(contract =>
      contract.clientId === clientId
    );
  }

  async getReviewsByProvider(providerId: string): Promise<Review[]> {
    await this.simulateNetworkDelay();
    return Array.from(this.reviews.values()).filter(review =>
      review.providerId === providerId && review.isVisible
    );
  }

  // =============================================
  // MÉTODOS DE CREACIÓN (CREATE)
  // =============================================

  async createContractRequest(request: ContractRequest): Promise<ContractRequest> {
    await this.simulateNetworkDelay();
    this.contractRequests.set(request.id, request);

    // Agregar a las relaciones
    const provider = this.providers.get(request.providerId);
    if (provider) {
      provider.contractRequests.push(request);
    }

    return request;
  }

  async createContract(contract: Contract): Promise<Contract> {
    await this.simulateNetworkDelay();
    this.contracts.set(contract.id, contract);

    // Agregar a las relaciones
    const service = this.services.get(contract.serviceId);
    if (service) {
      service.contracts.push(contract);
    }

    return contract;
  }

  async createReview(review: Review): Promise<Review> {
    await this.simulateNetworkDelay();
    this.reviews.set(review.id, review);

    // Agregar a las relaciones
    if (review.providerId) {
      const provider = this.providers.get(review.providerId);
      if (provider) {
        provider.reviews.push(review);
      }
    }

    const contract = this.contracts.get(review.contractId);
    if (contract) {
      contract.review = review;
    }

    return review;
  }

  // =============================================
  // MÉTODOS DE ACTUALIZACIÓN (UPDATE)
  // =============================================

  async updateContractRequestStatus(
    requestId: string,
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired',
    responseMessage?: string
  ): Promise<ContractRequest | undefined> {
    await this.simulateNetworkDelay();

    const request = this.contractRequests.get(requestId);
    if (request) {
      request.status = status;
      request.providerResponseAt = new Date();
      if (responseMessage) {
        request.providerResponseMessage = responseMessage;
      }
    }

    return request;
  }

  async updateContractStatus(
    contractId: string,
    status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
  ): Promise<Contract | undefined> {
    await this.simulateNetworkDelay();

    const contract = this.contracts.get(contractId);
    if (contract) {
      contract.status = status;
    }

    return contract;
  }

  // =============================================
  // MÉTODOS DE BÚSQUEDA Y FILTRADO
  // =============================================

  async searchProviders(query: string, filters?: {
    categories?: string[];
    location?: string;
    priceRange?: { min: number; max: number };
  }): Promise<Provider[]> {
    await this.simulateNetworkDelay();

    let results = Array.from(this.providers.values()).filter(provider =>
      provider.isActive && (
        provider.artisticName.toLowerCase().includes(query.toLowerCase()) ||
        provider.biography.toLowerCase().includes(query.toLowerCase()) ||
        provider.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
      )
    );

    if (filters?.categories && filters.categories.length > 0) {
      results = results.filter(provider =>
        filters.categories!.some(cat => provider.categories.includes(cat))
      );
    }

    if (filters?.location) {
      results = results.filter(provider =>
        provider.generalLocation.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    return results;
  }

  // =============================================
  // UTILIDADES
  // =============================================

  private async simulateNetworkDelay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para obtener estadísticas (útil para dashboards)
  getStatistics() {
    return {
      totalProviders: this.providers.size,
      activeProviders: Array.from(this.providers.values()).filter(p => p.isActive).length,
      totalClients: this.clients.size,
      totalServices: this.services.size,
      totalContracts: this.contracts.size,
      pendingRequests: Array.from(this.contractRequests.values()).filter(r => r.status === 'Pending').length,
      completedContracts: Array.from(this.contracts.values()).filter(c => c.status === 'Completed').length,
    };
  }

  // Reset data (útil para testing)
  reset(): void {
    this.users.clear();
    this.providers.clear();
    this.clients.clear();
    this.portfolios.clear();
    this.portfolioItems.clear();
    this.services.clear();
    this.contractRequests.clear();
    this.contracts.clear();
    this.reviews.clear();
    this.payments.clear();
    this.seedData();
  }
}