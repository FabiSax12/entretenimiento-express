import type { Service } from "./Service";

export class PortfolioItem {
  id: string;
  portfolioId: string;
  type: 'Video' | 'Photo' | 'Audio' | 'Description' | 'Testimonial';
  fileUrl?: string;
  title: string;
  description: string;
  createdAt: Date;
  isVisible: boolean;
  relatedServices: Service[];

  constructor(
    id: string,
    portfolioId: string,
    type: 'Video' | 'Photo' | 'Audio' | 'Description' | 'Testimonial',
    title: string,
    description: string,
    createdAt: Date,
    isVisible: boolean,
    fileUrl?: string
  ) {
    this.id = id;
    this.portfolioId = portfolioId;
    this.type = type;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.isVisible = isVisible;
    this.fileUrl = fileUrl;
    this.relatedServices = [];
  }
}