import {DrupalError} from '../DrupalError';
import {AxiosResponse} from 'axios';

export type DrupalClientResponse = AxiosResponse;
export interface ClientInterface {
  client: any;
  setClient(client: any): ClientInterface;
  getClient(): any;
  call(
    method: string,
    path: string,
    config?: {[key: string]: any;}
  ): Promise<any>;
  getDrupalError(response: any): DrupalError;
  addDefaultHeaders(headers: {[key: string]: any;}): ClientInterface;
}

export interface BasicAuthParams {
  username: string;
  password: string;
}
