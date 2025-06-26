import { InMemoryCategoryRepository } from "./InMemoryCategoryRepository";
import { InMemoryContractRequestRepository } from "./InMemoryContractRequest";
import { InMemoryPortfolioRepository } from "./InMemoryPortfolioRepository";
import InMemoryProviderRepository from "./InMemoryProviderRepository";
import { InMemoryReviewRepository } from "./InMemoryReviewsRepository";
import { InMemoryServiceRepository } from "./InMemoryServiceRepository";
import InMemoryUserRepository from "./InMemoryUserRepository";

export const userRepository = new InMemoryUserRepository();
export const categoryRepository = new InMemoryCategoryRepository();
export const providerRepository = new InMemoryProviderRepository(userRepository);
export const portfolioRepository = new InMemoryPortfolioRepository();
export const serviceRepository = new InMemoryServiceRepository();
export const reviewRepository = new InMemoryReviewRepository();
export const contractRequestRepository = new InMemoryContractRequestRepository();