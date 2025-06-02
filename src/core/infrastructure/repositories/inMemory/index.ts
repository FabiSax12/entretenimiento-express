import { InMemoryCategoryRepository } from "./InMemoryCategoryRepository";
import { InMemoryPortfolioRepository } from "./InMemoryPortfolioRepository";
import InMemoryProviderRepository from "./InMemoryProviderRepository";
import { InMemoryServiceRepository } from "./InMemoryServiceRepository";
import InMemoryUserRepository from "./InMemoryUserRepository";

export const userRepository = new InMemoryUserRepository();
export const categoryRepository = new InMemoryCategoryRepository();
export const providerRepository = new InMemoryProviderRepository(userRepository);
export const portfolioRepository = new InMemoryPortfolioRepository();
export const serviceRepository = new InMemoryServiceRepository();