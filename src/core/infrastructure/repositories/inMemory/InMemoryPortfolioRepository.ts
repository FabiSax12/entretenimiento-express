import { PortfolioItem } from "@/core/domain/entities/PortfolioItem";
import { Portfolio } from "@/core/domain/entities/Portfolio";
import type { PortfolioRepository } from "@/core/domain/repositories/PortfolioRepository";
import portfoliosJson from "@/core/infrastructure/data/Portfolios.json";

export class InMemoryPortfolioRepository implements PortfolioRepository {
  private portfolios: Map<string, Portfolio> = new Map();

  constructor() {
    portfoliosJson.forEach(portfolio => {

      const portfolioInstance = new Portfolio(
        portfolio.id,
        portfolio.providerId,
        portfolio.name,
        portfolio.items.map(item => new PortfolioItem(
          item.id,
          item.portfolioId,
          item.type as PortfolioItem["type"],
          item.title,
          item.description,
          new Date(item.createdAt),
          item.active,
          item.fileUrl,
        ))
      )

      this.portfolios.set(portfolio.id, portfolioInstance)
    })
  }

  async getAll(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values());
  }

  async getById(portfolioId: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(portfolioId);
  }

  async getByProviderId(providerId: string): Promise<Portfolio> {
    const portfolios = Array.from(this.portfolios.values())
      .filter(portfolio => portfolio.providerId === providerId);

    if (portfolios.length === 0) {
      throw new Error(`No portfolios found for provider ID: ${providerId}`);
    }

    // Assuming we return the first portfolio found for the provider
    return portfolios[0];
  }

  async create(portfolio: string): Promise<Portfolio> {
    const portfolioData = JSON.parse(portfolio);
    const newPortfolio = new Portfolio(
      portfolioData.id,
      portfolioData.providerId,
      portfolioData.name,
      portfolioData.items.map((item: any) => new PortfolioItem(
        item.id,
        item.portfolioId,
        item.type as PortfolioItem["type"],
        item.title,
        item.description,
        new Date(item.createdAt),
        item.active,
        item.fileUrl
      ))
    );

    this.portfolios.set(newPortfolio.id, newPortfolio);
    return newPortfolio;
  }

  async update(portfolio: string): Promise<Portfolio | undefined> {
    const portfolioData = JSON.parse(portfolio);
    const existingPortfolio = this.portfolios.get(portfolioData.id);

    if (!existingPortfolio) {
      return undefined;
    }

    const updatedPortfolio = new Portfolio(
      existingPortfolio.id,
      existingPortfolio.providerId,
      portfolioData.name || existingPortfolio.name,
      portfolioData.items.map((item: any) => new PortfolioItem(
        item.id,
        item.portfolioId,
        item.type as PortfolioItem["type"],
        item.title,
        item.description,
        new Date(item.createdAt),
        item.active,
        item.fileUrl
      ))
    );

    this.portfolios.set(updatedPortfolio.id, updatedPortfolio);
    return updatedPortfolio;
  }

  async delete(portfolioId: string): Promise<void> {
    this.portfolios.delete(portfolioId);
  }
}