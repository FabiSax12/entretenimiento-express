import type { PortfolioItem } from "./PortfolioItem";

export class Portfolio {
  id: string;
  providerId: string;
  name?: string;
  items: PortfolioItem[];

  constructor(id: string, providerId: string, name?: string, items?: PortfolioItem[]) {
    this.id = id;
    this.providerId = providerId;
    this.name = name;
    this.items = items || [];
  }
}