export class PublicContact {
  email: string;
  phone: string;

  constructor(
    email: string,
    phone: string,
    socialMedia?: Record<string, string>
  ) {
    this.email = email;
    this.phone = phone;
  }
}