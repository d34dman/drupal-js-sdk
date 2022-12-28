import { DrupalErrorInterface } from './error';
export interface ClientInterface {
  client: any;
  setClient(client: any): ClientInterface;
  getClient(): any;
  call(
    method: string,
    path: string,
    config?: { [key: string]: any; }
  ): Promise<any>;
  getDrupalError(response: any): DrupalErrorInterface;
  addDefaultHeaders(headers: { [key: string]: any; }): ClientInterface;
}
export interface DrupalClientInstance extends DrupalClient {
  (config: DrupalClientRequestConfig): DrupalClientPromise;
  (url: string, config?: DrupalClientRequestConfig): DrupalClientPromise;
}
export interface DrupalClient {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(config?: DrupalClientRequestConfig): DrupalClient;
  defaults: DrupalClientDefaults;
  interceptors: {
    request: DrupalClientInterceptorManager<DrupalClientRequestConfig>;
    response: DrupalClientInterceptorManager<DrupalClientResponse>;
  };
  getUri(config?: DrupalClientRequestConfig): string;
  request<T = any, R = DrupalClientResponse<T>, D = any>(config: DrupalClientRequestConfig<D>): Promise<R>;
  get<T = any, R = DrupalClientResponse<T>, D = any>(url: string, config?: DrupalClientRequestConfig<D>): Promise<R>;
  delete<T = any, R = DrupalClientResponse<T>, D = any>(url: string, config?: DrupalClientRequestConfig<D>): Promise<R>;
  head<T = any, R = DrupalClientResponse<T>, D = any>(url: string, config?: DrupalClientRequestConfig<D>): Promise<R>;
  options<T = any, R = DrupalClientResponse<T>, D = any>(url: string, config?: DrupalClientRequestConfig<D>): Promise<R>;
  post<T = any, R = DrupalClientResponse<T>, D = any>(url: string, data?: D, config?: DrupalClientRequestConfig<D>): Promise<R>;
  put<T = any, R = DrupalClientResponse<T>, D = any>(url: string, data?: D, config?: DrupalClientRequestConfig<D>): Promise<R>;
  patch<T = any, R = DrupalClientResponse<T>, D = any>(url: string, data?: D, config?: DrupalClientRequestConfig<D>): Promise<R>;
}

export interface DrupalClientDefaults<D = any> extends Omit<DrupalClientRequestConfig<D>, 'headers'> {
  headers: HeadersDefaults;
}

export interface HeadersDefaults {
  common: DrupalClientRequestHeaders;
  delete: DrupalClientRequestHeaders;
  get: DrupalClientRequestHeaders;
  head: DrupalClientRequestHeaders;
  post: DrupalClientRequestHeaders;
  put: DrupalClientRequestHeaders;
  patch: DrupalClientRequestHeaders;
  options?: DrupalClientRequestHeaders;
  purge?: DrupalClientRequestHeaders;
  link?: DrupalClientRequestHeaders;
  unlink?: DrupalClientRequestHeaders;
}
export interface DrupalClientInterceptorManager<V> {
  use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number;
  eject(id: number): void;
}

export interface DrupalClientRequestConfig<D = any> {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: DrupalClientRequestTransformer | DrupalClientRequestTransformer[];
  transformResponse?: DrupalClientResponseTransformer | DrupalClientResponseTransformer[];
  headers?: DrupalClientRequestHeaders;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: D;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: DrupalClientAdapter;
  auth?: DrupalClientBasicCredentials;
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: DrupalClientProxyConfig | false;
  cancelToken?: CancelToken;
  decompress?: boolean;
  transitional?: TransitionalOptions;
  signal?: AbortSignal;
  insecureHTTPParser?: boolean;
}

export interface DrupalClientResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: DrupalClientResponseHeaders;
  config: DrupalClientRequestConfig<D>;
  request?: any;
}

export type DrupalClientResponseHeaders = Record<string, string> & {
  "set-cookie"?: string[]
};


export type Method =
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

export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

export type responseEncoding =
  | 'ascii' | 'ASCII'
  | 'ansi' | 'ANSI'
  | 'binary' | 'BINARY'
  | 'base64' | 'BASE64'
  | 'base64url' | 'BASE64URL'
  | 'hex' | 'HEX'
  | 'latin1' | 'LATIN1'
  | 'ucs-2' | 'UCS-2'
  | 'ucs2' | 'UCS2'
  | 'utf-8' | 'UTF-8'
  | 'utf8' | 'UTF8'
  | 'utf16le' | 'UTF16LE';

export type DrupalClientRequestHeaders = Record<string, string | number | boolean>;

export interface DrupalClientRequestTransformer {
  (data: any, headers?: DrupalClientRequestHeaders): any;
}

export interface DrupalClientResponseTransformer {
  (data: any, headers?: DrupalClientResponseHeaders): any;
}
export interface DrupalClientAdapter {
  (config: DrupalClientRequestConfig): DrupalClientPromise;
}
export type DrupalClientPromise<T = any> = Promise<DrupalClientResponse<T>>
export interface DrupalClientBasicCredentials {
  username: string;
  password: string;
}

export interface DrupalClientRequestConfig<D = any> {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: DrupalClientRequestTransformer | DrupalClientRequestTransformer[];
  transformResponse?: DrupalClientResponseTransformer | DrupalClientResponseTransformer[];
  headers?: DrupalClientRequestHeaders;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: D;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: DrupalClientAdapter;
  auth?: DrupalClientBasicCredentials;
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: DrupalClientProxyConfig | false;
  cancelToken?: CancelToken;
  decompress?: boolean;
  transitional?: TransitionalOptions;
  signal?: AbortSignal;
  insecureHTTPParser?: boolean;
}
export interface TransitionalOptions {
  silentJSONParsing?: boolean;
  forcedJSONParsing?: boolean;
  clarifyTimeoutError?: boolean;
}

export interface Cancel {
  message: string | undefined;
}

export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

export interface DrupalClientProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
  protocol?: string;
}