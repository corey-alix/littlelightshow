export interface FaunaException {
  name: string;
  message: string;
  description: string;
  requestResult: any;
}
