import {DrupalError} from '../DrupalError';

export interface ApiClientInterface {
  client: any;
  setClient(client: any): ApiClientInterface;
  getClient(): any;
  request(
    method: string,
    path: string,
    config?: {[key: string]: any;}
  ): Promise<any>;
  getDrupalError(response: any): DrupalError;
  addDefaultHeaders(headers: {[key: string]: any;}): ApiClientInterface;
}
