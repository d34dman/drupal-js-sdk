import {AxiosResponse} from 'axios';
import { DrupalErrorInterface } from './error';

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
  getDrupalError(response: any): DrupalErrorInterface;
  addDefaultHeaders(headers: {[key: string]: any;}): ClientInterface;
}

export interface BasicAuthParams {
  username: string;
  password: string;
}
