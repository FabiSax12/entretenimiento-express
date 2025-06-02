import { User } from './User';
import { Contract } from './Contract';
import { Review } from './Review';

export class Client extends User {
  name: string;
  phone: string;
  reviewsGiven: Review[];
  contracts: Contract[];

  constructor(user: User, name: string, phone: string) {
    super(user.id, user.email, user.passwordHash, 'Client', user.createdAt, user.updatedAt);
    this.name = name;
    this.phone = phone;
    this.reviewsGiven = [];
    this.contracts = [];
  }
}