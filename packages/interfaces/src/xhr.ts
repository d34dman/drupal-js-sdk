import { DrupalErrorInterface } from './error';

export interface XhrInterface {
  setClient(client: unknown): XhrInterface;
  getClient(): unknown;
  call(
    method: string,
    path: string,
    config?: XhrRequestConfig
  ): Promise<XhrResponse>;
  getDrupalError(response: XhrResponse): DrupalErrorInterface;
  addDefaultHeaders(headers: XhrRequestHeaders): XhrInterface;
  /** Merge additional default request options into the client configuration. */
  addDefaultOptions(options: Partial<XhrRequestConfig>): XhrInterface;
  /** Optional: add a request interceptor */
  addRequestInterceptor?(fn: (config: XhrRequestConfig) => Promise<XhrRequestConfig> | XhrRequestConfig): XhrInterface;
  /** Optional: add a response interceptor */
  addResponseInterceptor?(fn: (response: XhrResponse) => Promise<XhrResponse> | XhrResponse): XhrInterface;
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
  /** Abort controller signal for cancellation */
  signal?: AbortSignal;
  /** Request mode passthrough for fetch */
  mode?: RequestMode;
  /** Request cache hint for fetch */
  cache?: RequestCache;
  /** Client-side timeout in milliseconds */
  timeoutMs?: number;
  /** Retry/backoff policy */
  retry?: {
    retries: number;
    factor?: number;
    minTimeoutMs?: number;
    maxTimeoutMs?: number;
    /** HTTP status codes to retry on (e.g., 429, 503). */
    retryOn?: number[];
  };
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