import { User } from "./User";
import type { Portfolio } from "./Portfolio";
import type { Service } from "./Service";
import type { Review } from "./Review";
import type { ContractRequest } from "./ContractRequest";
import type { PublicContact } from "../value-objects/PublicContact";
import type { Category } from "./Category";

export class Provider extends User {
  artisticName: string;
  biography: string;
  publicContact: PublicContact;
  generalLocation: string;
  categories: Category['id'][];
  portfolio: Portfolio['id'];
  services: Service['id'][];
  contractRequests: ContractRequest['id'][];
  reviews: Review['id'][];
  isActive: boolean;
  avatarUrl?: string;

  constructor(
    user: User,
    artisticName: string,
    biography: string,
    publicContact: PublicContact,
    categories: Category['id'][],
    generalLocation: string,
    portfolio: Portfolio['id'],
    services: Service['id'][],
    contractRequests: ContractRequest['id'][],
    reviews: Review['id'][],
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

  public addService(service: Service['id']): void {
    this.services.push(service);
  }
}