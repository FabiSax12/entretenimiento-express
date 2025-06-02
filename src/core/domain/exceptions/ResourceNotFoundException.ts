export class ResourceNotFoundException extends Error {
  constructor(resourceType: string, resourceId: string) {
    super(`${resourceType} with ID ${resourceId} not found.`);
    this.name = "ResourceNotFoundException";
    this.stack = new Error().stack; // Capture the stack trace
  }
}