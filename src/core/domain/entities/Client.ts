import { User } from './User';
import { Contract } from './Contract';
import { Review } from './Review';

export class Client extends User {
  reviewsGiven: Review[];
  contracts: Contract[];

  constructor(user: User) {
    super(user.id, user.email, user.passwordHash, 'Client', user.createdAt, user.updatedAt);
    this.reviewsGiven = [];
    this.contracts = [];

  }
}