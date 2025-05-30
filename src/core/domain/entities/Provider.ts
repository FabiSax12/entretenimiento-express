import { User } from "./User";
import type { Portfolio } from "./Portfolio";
import type { Service } from "./Service";
import type { Review } from "./Review";
import type { ContractRequest } from "./ContractRequest";
import type { PublicContact } from "../value-objects/PublicContact";

export class Provider extends User {
  artisticName: string;
  biography: string;
  publicContact: PublicContact;
  categories: string[];
  generalLocation: string;
  portfolio: Portfolio;
  services: Service[];
  contractRequests: ContractRequest[];
  reviews: Review[];
  isActive: boolean;
  avatarUrl?: string;

  constructor(
    user: User,
    artisticName: string,
    biography: string,
    publicContact: PublicContact,
    categories: string[],
    generalLocation: string,
    portfolio: Portfolio,
    services: Service[],
    contractRequests: ContractRequest[],
    reviews: Review[],
    isActive: boolean,
    avatarUrl?: string
  ) {
    super(user.id, user.email, user.passwordHash, 'Provider', user.createdAt, user.updatedAt);
    this.artisticName = artisticName;
    this.biography = biography;
    this.publicContact = publicContact;
    this.categories = categories;
    this.generalLocation = generalLocation;
    this.portfolio = portfolio;
    this.services = services;
    this.contractRequests = contractRequests;
    this.reviews = reviews;
    this.isActive = isActive;
    this.avatarUrl = avatarUrl;
  }

  public addService(service: Service): void {
    this.services.push(service);
  }
}