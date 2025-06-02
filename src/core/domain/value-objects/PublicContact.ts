export class PublicContact {
  email: string;
  phone: string;
  socialMedia?: Record<string, string>;

  constructor(
    email: string,
    phone: string,
    socialMedia?: Record<string, string>
  ) {
    this.email = email;
    this.phone = phone;
    this.socialMedia = socialMedia;
  }
}