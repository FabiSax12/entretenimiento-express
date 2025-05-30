export class User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'Client' | 'Provider';
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    passwordHash: string,
    role: 'Client' | 'Provider',
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}