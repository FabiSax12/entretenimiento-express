export class ContractRequest {
  id: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  eventDate: Date;
  eventTime?: string;
  eventLocation: string;
  eventType: string;
  clientMessage?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
  requestedAt: Date;
  providerResponseAt?: Date;
  providerResponseMessage?: string;

  constructor(
    id: string,
    clientId: string,
    providerId: string,
    serviceId: string,
    eventDate: Date,
    eventLocation: string,
    eventType: string,
    status: 'Pending',
    requestedAt: Date,
    eventTime?: string,
    clientMessage?: string
  ) {
    this.id = id;
    this.clientId = clientId;
    this.providerId = providerId;
    this.serviceId = serviceId;
    this.eventDate = eventDate;
    this.eventLocation = eventLocation;
    this.eventType = eventType;
    this.status = status;
    this.requestedAt = requestedAt;
    this.eventTime = eventTime;
    this.clientMessage = clientMessage;
  }
}