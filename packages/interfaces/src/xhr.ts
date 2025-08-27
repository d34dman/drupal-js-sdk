import { DrupalErrorInterface } from './error';

export interface XhrInterface {
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

export type XhrRequestHeaders = Record<string, string | number | boolean>;

export type XhrResponseHeaders = Record<string, string> & {
  "set-cookie"?: string[]
};

export interface XhrResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: XhrResponseHeaders;
  config: XhrRequestConfig<D>;
  request?: any;
}
export type XhrQueryParamPrimitive = string | number | boolean;
export type XhrQueryParamValue = XhrQueryParamPrimitive | XhrQueryParamPrimitive[];
export type XhrQueryParams = Record<string, XhrQueryParamValue>;

export interface XhrRequestConfig<D = any> {
  url?: string;
  method?: XhrMethod;
  baseURL?: string;
  headers?: XhrRequestHeaders;
  data?: D;
  params?: XhrQueryParams;
  withCredentials?: boolean;
  auth?: XhrBasicCredentials;
}

export type XhrMethod =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';