import { Payment } from './Payment';
import { Review } from './Review';

export class Contract {
  id: string;
  originalRequestId?: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  eventId?: string;
  contractDate: Date;
  eventDate: Date;
  agreedPrice: number;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  confirmedAt: Date;
  payments: Payment[];
  review?: Review;

  constructor(
    id: string,
    clientId: string,
    providerId: string,
    serviceId: string,
    eventDate: Date,
    agreedPrice: number,
    status: 'Confirmed',
    confirmedAt: Date,
    originalRequestId?: string,
    eventId?: string
  ) {
    this.id = id;
    this.originalRequestId = originalRequestId;
    this.clientId = clientId;
    this.providerId = providerId;
    this.serviceId = serviceId;
    this.eventId = eventId;
    this.contractDate = confirmedAt;
    this.eventDate = eventDate;
    this.agreedPrice = agreedPrice;
    this.status = status;
    this.confirmedAt = confirmedAt;
    this.payments = [];
  }
}