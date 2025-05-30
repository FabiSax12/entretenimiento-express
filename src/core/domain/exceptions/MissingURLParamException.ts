export class MissingURLParamException extends Error {
  constructor(paramName: string[]) {
    super(`Missing required URL parameter/s: ${JSON.stringify(paramName)}`);
    this.name = 'MissingURLParamException';
  }
}