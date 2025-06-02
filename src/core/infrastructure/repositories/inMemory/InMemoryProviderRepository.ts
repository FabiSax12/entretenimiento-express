import { Provider } from "@/core/domain/entities";
import { ResourceNotFoundException } from "@/core/domain/exceptions/ResourceNotFoundException";
import type { ProviderRepository } from "@/core/domain/repositories/ProviderRepository";
import type { UserRepository } from "@/core/domain/repositories/UserRepository";
import providersJson from "@/core/infrastructure/data/Providers.json";

export default class InMemoryProviderRepository implements ProviderRepository {
  private providers: Map<string, Provider> = new Map();
  private initialized = false;

  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('Initializing InMemoryProviderRepository...');

    const providerPromises = providersJson.map(async (providerData: any) => {
      try {
        console.log(`Loading provider for user ID: ${providerData.userId}`);

        const user = await this.userRepository.getUserById(providerData.userId);

        if (!user) {
          throw new ResourceNotFoundException("User", providerData.userId);
        }

        return new Provider(
          user,
          providerData.artisticName,
          providerData.biography,
          providerData.publicContact,
          providerData.categories,
          providerData.generalLocation,
          providerData.portfolio,
          providerData.services,
          providerData.contractRequests,
          providerData.reviews,
          providerData.isActive,
          providerData.avatarUrl
        );
      } catch (error) {
        console.error(`Error loading provider for user ${providerData.userId}:`, error);
        return null;
      }
    });

    const providers = (await Promise.all(providerPromises)).filter(provider => provider !== null) as Provider[];
    this.providers = new Map(providers.map(provider => [provider.id, provider]));
    this.initialized = true;

    console.log(`InMemoryProviderRepository initialized with ${this.providers.size} providers.`);
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async getAll(): Promise<Provider[]> {
    await this.ensureInitialized();
    return Array.from(this.providers.values());
  }

  async getById(providerId: string): Promise<Provider | undefined> {
    await this.ensureInitialized();
    console.log(this.providers.get(providerId));
    return this.providers.get(providerId);
  }

  async create(provider: Provider): Promise<Provider> {
    await this.ensureInitialized();
    this.providers.set(provider.id, provider);
    return provider;
  }

  async update(provider: Provider): Promise<Provider | undefined> {
    await this.ensureInitialized();
    if (!this.providers.has(provider.id)) {
      return undefined;
    }
    this.providers.set(provider.id, provider);
    return provider;
  }

  async delete(providerId: string): Promise<void> {
    await this.ensureInitialized();
    this.providers.delete(providerId);
  }
}