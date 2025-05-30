export class Review {
  id: string;
  clientId: string;
  providerId?: string;
  serviceId?: string;
  contractId: string;
  rating: number;
  comment: string;
  reviewedAt: Date;
  isVisible: boolean;

  constructor(
    id: string,
    clientId: string,
    contractId: string,
    rating: number,
    comment: string,
    reviewedAt: Date,
    isVisible: boolean,
    providerId?: string,
    serviceId?: string
  ) {
    this.id = id;
    this.clientId = clientId;
    this.contractId = contractId;
    this.rating = rating;
    this.comment = comment;
    this.reviewedAt = reviewedAt;
    this.isVisible = isVisible;
    this.providerId = providerId;
    this.serviceId = serviceId;
  }
}