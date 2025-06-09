export class InvalidCredentialsException extends Error {
  constructor(message = 'Invalid credentials provided') {
    super(message);
    this.name = 'InvalidCredentialsException';
  }
}