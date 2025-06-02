// src/core/infrastructure/data/mockData.ts (Suggested file path)

import { User } from "@/core/domain/entities/User";
import { Provider } from "@/core/domain/entities/Provider";
import { Client } from "@/core/domain/entities/Client";
import { Service } from "@/core/domain/entities/Service";
import { Portfolio } from "@/core/domain/entities/Portfolio";
import { PortfolioItem } from "@/core/domain/entities/PortfolioItem";
import { ContractRequest } from "@/core/domain/entities/ContractRequest";
import { Contract } from "@/core/domain/entities/Contract";
import { Review } from "@/core/domain/entities/Review";
import { PublicContact } from "@/core/domain/value-objects/PublicContact"; // Assuming you use this Value Object

// Users
const mockUser1 = new User("user-1", "djritmo@example.com", "hashedpass1", "Provider", new Date(), new Date());
const mockUser2 = new User("user-2", "johndoe@example.com", "hashedpass2", "Client", new Date(), new Date());
const mockUser3 = new User("user-3", "bandaXYZ@example.com", "hashedpass3", "Provider", new Date(), new Date());

// Providers
const mockProvider1 = new Provider(
  mockUser1, // Link to User
  "DJ Ritmo",
  "DJ profesional con más de 10 años de experiencia en eventos corporativos y fiestas privadas. Especializado en música latina, electrónica y pop internacional.",
  new PublicContact('djritmo@example.com', '+506 8888-8888', { instagram: 'djritmo', facebook: 'djritmo.cr' }),
  ["DJ", "Música Electrónica", "Pop"], // Categories
  "San José, Costa Rica",
  true, // isActive
  "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  [],
  [],
  true,

);

const mockProvider2 = new Provider(
  mockUser3, // Link to User
  "Banda Sonora",
  "Grupo musical versátil con repertorio que abarca desde rock clásico hasta cumbia y merengue, ideal para fiestas y eventos.",
  new PublicContact('bandasonora@example.com', '+506 7777-7777', {}),
  ["Música en vivo", "Rock", "Música Tropical"], // Categories
  "Heredia, Costa Rica",
  true,
  "https://i.pravatar.cc/150?u=a042581f4e29026704e" // Another avatar
);


// Clients
const mockClient1 = new Client(
  mockUser2, // Link to User
  "John Doe Pérez",
  "+506 9999-9999"
);


// PortfolioItems for DJ Ritmo (Provider 1)
const mockPortfolioItem1_1 = new PortfolioItem("item-1", "portfolio-1", "Video", "Festival Verano 2023", "Actuación principal en el Festival de Verano en Playa Jacó", new Date("2023-03-15"), true, "/placeholder.svg?height=200&width=300");
const mockPortfolioItem1_2 = new PortfolioItem("item-2", "portfolio-1", "Photo", "Evento Corporativo Tech Summit", "Música ambiental y DJ set para la gala de cierre", new Date("2023-05-22"), true, "/placeholder.svg?height=200&width=300");
const mockPortfolioItem1_3 = new PortfolioItem("item-3", "portfolio-1", "Audio", "Mix Tropical 2023", "Compilación de éxitos tropicales remixados", new Date("2023-06-10"), true, "/placeholder.svg?height=200&width=300");
const mockPortfolioItem1_4 = new PortfolioItem("item-4", "portfolio-1", "Description", "Propuesta para Eventos Corporativos", "Descripción detallada de servicios para eventos empresariales", new Date("2023-01-05"), true, "/placeholder.svg?height=200&width=300");

// Portfolio for DJ Ritmo
const mockPortfolio1 = new Portfolio("portfolio-1", mockProvider1.id, "DJ Ritmo's Portfolio");
mockPortfolio1.items = [mockPortfolioItem1_1, mockPortfolioItem1_2, mockPortfolioItem1_3, mockPortfolioItem1_4];

// Link Portfolio to Provider
mockProvider1.portfolio = mockPortfolio1;


// Services for DJ Ritmo
const mockService1_1 = new Service(
  'service-1',
  'DJ para Eventos Corporativos',
  'Servicio completo de DJ para eventos empresariales, incluyendo música ambiental y animación profesional.',
  150000,
  'PerEvent',
  mockProvider1.id, // Link to Provider
  true,
  '2 horas',
  'Equipo de sonido profesional, conexión a internet estable'
);
mockService1_1.categories = ["Corporativo", "DJ"]; // Example categories for the service
mockService1_1.portfolioItemIds = ['item-2', 'item-4']; // Link service to portfolio items by ID

const mockService1_2 = new Service(
  'service-2',
  'DJ para Fiestas Privadas',
  'Música personalizada y ambiente festivo para cumpleaños, aniversarios y otras celebraciones privadas.',
  100000,
  'PerEvent',
  mockProvider1.id,
  true,
  '3 horas',
  'Equipo de sonido básico'
);
mockService1_2.categories = ["Fiestas Privadas", "DJ", "Pop"];
mockService1_2.portfolioItemIds = ['item-1', 'item-3'];

// Link Services to Provider
mockProvider1.services = [mockService1_1, mockService1_2];


// Contract Requests (Example)
const mockContractRequest1 = new ContractRequest(
  'req-1',
  mockClient1.id, // Client ID
  mockProvider1.id, // Provider ID
  mockService1_1.id, // Service ID
  new Date('2025-06-20'),
  '19:00',
  'Hotel InterContinental, San José',
  'Evento Corporativo',
  'Solicitud para gala de fin de año.',
  'Pending',
  new Date()
);

// Link Contract Request to Provider (Provider receives it)
mockProvider1.contractRequests = [mockContractRequest1];

// Link Contract Request to Client (Client sent it)
mockClient1.contractRequestsSent = [mockContractRequest1]; // Assuming Client class has this property


// --- Data Repository (Simulated) ---
// This object holds all your mock data and provides methods to "query" it

const mockDatabase = {
  users: [mockUser1, mockUser2, mockUser3],
  providers: [mockProvider1, mockProvider2],
  clients: [mockClient1],
  portfolios: [mockPortfolio1], // Could have more portfolios for other providers
  portfolioItems: [
    mockPortfolioItem1_1, mockPortfolioItem1_2, mockPortfolioItem1_3, mockPortfolioItem1_4
    // Add portfolio items for other providers here
  ],
  services: [mockService1_1, mockService1_2], // Add services for other providers here
  contractRequests: [mockContractRequest1], // Add other requests
  contracts: [], // Add mock contracts here
  reviews: [] // Add mock reviews here
};


// --- Simulated Data Fetching Functions ---

// Simulate getting a Provider by ID and resolving related entities
export async function getProviderById(id: string): Promise<Provider | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Find the provider by ID
  const provider = mockDatabase.providers.find(p => p.id === id);

  if (!provider) {
    return undefined; // Provider not found
  }

  // Simulate resolving relationships:

  // 1. Resolve Portfolio
  const portfolio = mockDatabase.portfolios.find(p => p.providerId === provider.id);
  if (portfolio) {
    // Resolve Portfolio Items within the found portfolio
    portfolio.items = mockDatabase.portfolioItems.filter(item => item.portfolioId === portfolio.id);
    provider.portfolio = portfolio;
  } else {
    // Handle provider with no portfolio (or create a default empty one)
    provider.portfolio = new Portfolio(`portfolio-${provider.id}`, provider.id, "Default Portfolio");
    provider.portfolio.items = [];
  }


  // 2. Resolve Services
  const services = mockDatabase.services.filter(s => s.providerId === provider.id);
  provider.services = services.map(service => {
    // For each service, resolve its related PortfolioItems
    const relatedItems = mockDatabase.portfolioItems.filter(item =>
      // Check if service.portfolioItemIds exists and includes the item.id
      service.portfolioItemIds?.includes(item.id)
    );
    // IMPORTANT: Populate the property in your Service class that holds the ITEMS
    // Assuming you added relatedPortfolioItems: PortfolioItem[] to Service class
    // service.relatedPortfolioItems = relatedItems; // Uncomment this line
    return service; // Return the service with relationships resolved
  });

  // 3. Resolve Contract Requests (those received by this provider)
  provider.contractRequests = mockDatabase.contractRequests.filter(req => req.providerId === provider.id);
  // In a real app, you might resolve client, service, and contract details for these requests

  // 4. Resolve Reviews (those received about this provider)
  provider.reviews = mockDatabase.reviews.filter(review => review.providerId === provider.id);
  // In a real app, you might resolve client and contract details for these reviews

  return provider; // Return the fully "hydrated" provider object
}

// async function getServiceById(id: string): Promise<Service | undefined> { ... }
// async function getClientById(id: string): Promise<Client | undefined> { ... }
