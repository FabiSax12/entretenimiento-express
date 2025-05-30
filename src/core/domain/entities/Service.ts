import type { Contract } from "./Contract";

export class Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  priceType: 'Fixed' | 'Hourly' | 'PerEvent' | 'StartingFrom';
  estimatedDuration?: string;
  technicalRequirements?: string;
  providerId: string;
  portfolioItems: string[];
  contracts: Contract[];
  isActive: boolean;
  createdAt: Date;
  categories: string[];

  constructor(
    id: string,
    name: string,
    description: string,
    basePrice: number,
    priceType: 'Fixed' | 'Hourly' | 'PerEvent' | 'StartingFrom',
    providerId: string,
    isActive: boolean,
    createdAt: Date,
    categories: string[],
    portfolioItems?: string[],
    estimatedDuration?: string,
    technicalRequirements?: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.basePrice = basePrice;
    this.priceType = priceType;
    this.providerId = providerId;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.categories = categories;
    this.estimatedDuration = estimatedDuration;
    this.technicalRequirements = technicalRequirements;
    this.portfolioItems = portfolioItems || [];
    this.contracts = [];
  }
}