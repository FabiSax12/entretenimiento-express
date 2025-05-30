export class NotFoundProviderId extends Error {
  constructor(providerId: string) {
    super(`Provider with ID ${providerId} not found.`);
    this.name = "NotFoundProviderId";
    this.stack = new Error().stack; // Capture the stack trace
  }
}