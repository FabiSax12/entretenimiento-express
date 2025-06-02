export class MethodNotImplementedException extends Error {
  constructor(methodName: string) {
    super(`Method "${methodName}" is not implemented.`);
    this.name = "MethodNotImplementedException";
  }
}