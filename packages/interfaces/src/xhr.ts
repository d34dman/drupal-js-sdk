import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosBasicCredentials
} from 'axios';

import { DrupalErrorInterface } from './error';

export interface XhrInterface {
  client: any;
  setClient(client: any): XhrInterface;
  getClient(): any;
  call(
    method: string,
    path: string,
    config?: { [key: string]: any; }
  ): Promise<any>;
  getDrupalError(response: any): DrupalErrorInterface;
  addDefaultHeaders(headers: { [key: string]: any; }): XhrInterface;
}

export interface XhrBasicCredentials {
  username: string;
  password: string;
}

export interface XhrInstance extends AxiosInstance {

}

export interface XhrRequestConfig extends AxiosRequestConfig {

}

export interface XhrResponse extends AxiosResponse {

}

export type XhrMethod = Method;