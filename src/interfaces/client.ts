import {DrupalError} from '../DrupalError';

export interface ClientInterface {
  client: any;
  setClient(client: any): ClientInterface;
  getClient(): any;
  request(
    method: string,
    path: string,
    config?: {[key: string]: any;}
  ): Promise<any>;
  getDrupalError(response: any): DrupalError;
  addDefaultHeaders(headers: {[key: string]: any;}): ClientInterface;
}
