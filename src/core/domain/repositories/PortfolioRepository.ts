import type { Portfolio } from "../entities";

export interface PortfolioRepository {
  getAll(): Promise<Portfolio[]>;
  getById(portfolioId: string): Promise<Portfolio | undefined>;
  getByProviderId(providerId: string): Promise<Portfolio>;
  create(portfolio: string): Promise<Portfolio>;
  update(portfolio: string): Promise<Portfolio | undefined>;
  delete(portfolioId: string): Promise<void>;
}