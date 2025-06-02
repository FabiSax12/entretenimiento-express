import { Provider } from "@/core/domain/entities/Provider";
import { Portfolio } from '@/core/domain/entities/Portfolio';
import { PortfolioItem } from '@/core/domain/entities/PortfolioItem';
import { User } from '@/core/domain/entities/User'
import { NotFoundProviderId } from "@/core/domain/exceptions/NotFoundProviderId";
import { delay } from "@/utils/delay";
import { PublicContact } from "@/core/domain/value-objects/PublicContact";
import { Service } from "@/core/domain/entities/Service";

// --- Placeholder Data using Domain Classes ---
const simulatedUserData = new User("user-1", "djritmo@example.com", "hashedpassword123", "Provider", new Date(), new Date());

const simulatedPortfolioItems: PortfolioItem[] = [
  new PortfolioItem("item-1", "portfolio-1", "Video", "Festival Verano 2023", "Actuación principal en el Festival de Verano en Playa Jacó", new Date("2023-03-15"), true, "/placeholder.svg?height=200&width=300"),
  new PortfolioItem("item-2", "portfolio-1", "Photo", "Evento Corporativo Tech Summit", "Música ambiental y DJ set para la gala de cierre", new Date("2023-05-22"), true, "/placeholder.svg?height=200&width=300"),
  new PortfolioItem("item-3", "portfolio-1", "Audio", "Mix Tropical 2023", "Compilación de éxitos tropicales remixados", new Date("2023-06-10"), true, "/placeholder.svg?height=200&width=300"),
  new PortfolioItem("item-4", "portfolio-1", "Description", "Propuesta para Eventos Corporativos", "Descripción detallada de servicios para eventos empresariales", new Date("2023-01-05"), true, "/placeholder.svg?height=200&width=300"),
  new PortfolioItem("item-5", "portfolio-1", "Photo", "Boda García-Hernández", "Servicio completo de DJ para ceremonia y recepción", new Date("2023-07-30"), true, "/placeholder.svg?height=200&width=300"),
  new PortfolioItem("item-6", "portfolio-1", "Video", "Demo Reel 2023", "Compilación de los mejores momentos del año", new Date("2023-12-15"), true, "/placeholder.svg?height=200&width=300"),
];

const simulatedPortfolio = new Portfolio("portfolio-1", "provider-1", "DJ Ritmo's Portfolio");
simulatedPortfolio.items = simulatedPortfolioItems;

const simulatedProviderData = new Provider(
  simulatedUserData,
  "DJ Ritmo",
  "DJ profesional con más de 10 años de experiencia en eventos corporativos y fiestas privadas. Especializado en música latina, electrónica y pop internacional.",
  new PublicContact('djritmo@example.com', '+506 8888-8888', { instagram: 'djritmo', facebook: 'djritmo.cr' }),
  ["DJ", "Música en vivo", "Eventos corporativos", "Fiestas privadas"],
  "San José, Costa Rica",
  simulatedPortfolio,
  [
    new Service(
      '1',
      'DJ para Eventos Corporativos',
      'Servicio completo de DJ para eventos empresariales, incluyendo música ambiental y animación profesional.',
      150000,
      'PerEvent',
      'user-1',
      true,
      new Date('2025-05-20'),
      ["Corporativo", "DJ", "Música en vivo"],
      ['item-2', 'item-4'],
      '2 horas',
      'Equipo de sonido profesional, conexión a internet estable'
    )
  ],
  [],
  [],
  true,
  'https://i.pravatar.cc/150?u=a042581f4e29026704d'
);
// --- End Placeholder Data ---




export async function getProvider(id: string): Promise<Provider> {

  await delay(3000);

  if (id !== simulatedProviderData.id) {
    throw new NotFoundProviderId(id);
  }

  return simulatedProviderData;
}