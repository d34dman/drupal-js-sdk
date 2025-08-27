import {XhrInterface, XhrRequestConfig, XhrResponse, XhrMethod, XhrQueryParams} from '@drupal-js-sdk/interfaces';
import {StorageRecordInterface} from '@drupal-js-sdk/interfaces';
import { btoa } from 'buffer';
import {Client} from './Client';

type FetchFunctionType = (input: any, init?: any) => Promise<Response>;
export class FetchClient extends Client implements XhrInterface {
  protected client: FetchFunctionType;
  protected config: StorageRecordInterface;

  constructor(config: StorageRecordInterface = {}) {
    super();
    checkFetcher();
    this.config = config;
    this.client = fetch;
  }

  public setClient(fetchClient:FetchFunctionType = fetch): XhrInterface {
    this.client = fetchClient;
    return this;
  }

  public getClient() {
    return this.client;
  }

  public addDefaultHeaders(headers: StorageRecordInterface): XhrInterface {
    this.config.headers = {
      ...this.config.headers,
      ...headers
    }
    return this;
  }

  public call(
    method: XhrMethod,
    path: string,
    config?: StorageRecordInterface,
  ): Promise<XhrResponse> {
    const reqCofnig: XhrRequestConfig = {
      method,
      url: path,
      ...this.config,
      ...config,
    };
    return this.request(reqCofnig)
      .then((response) => {
        return response;
      }, (response) => {
        throw this.getDrupalError(response);
      });
  }

  protected async request(reqConfig: XhrRequestConfig): Promise<XhrResponse> {
    let path = '';
    const args = {
      headers: reqConfig.headers ?? {},
      method: 'get',
      credentials: 'same-origin'
    };
    // Identify and set path for the request.
    const baseUrl = reqConfig.baseURL ?? '';
    const reqUrl = reqConfig.url + '';
    path = buildFullPath(baseUrl, reqUrl);
    // Set config.method
    if (reqConfig.method) {
      args.method = reqConfig.method.toLowerCase();
    }

    if (reqConfig.withCredentials !== undefined && reqConfig.withCredentials) {
      args.credentials = 'include';
    }

    if (reqConfig.auth) {
      args.headers = {
        ...args.headers,
        Authorization: 'Basic ' + base64Encoder(reqConfig.auth.username + ":" + reqConfig.auth.password),
      };
    }
    // Append query params if provided
    if (reqConfig.params) {
      const q = serializeQueryParams(reqConfig.params);
      if (q.length > 0) {
        const joiner = path.includes('?') ? '&' : '?';
        path = `${path}${joiner}${q}`;
      }
    }
    return this.client(path, args)
      .then(async function(response: Response) {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        const data = await response.json();
        let responseHeaders = {};
        if (response.headers) {
          responseHeaders = Object.fromEntries(response.headers.entries())
        }
        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          request: {
            path,
            ...args
          },
          config: reqConfig
        }
      });
  }
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
 function buildFullPath(baseURL: string, requestedURL: string) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
 function isAbsoluteURL(url:string) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
 function combineURLs(baseURL: string, relativeURL: string) {
  return (relativeURL === '')
    ? baseURL
    : baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
}

function serializeQueryParams(params: XhrQueryParams): string {
  const usp = new URLSearchParams();
  const append = (key: string, value: string | number | boolean) => {
    usp.append(key, String(value));
  };
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const v of value) append(key, v);
    } else {
      append(key, value);
    }
  }
  return usp.toString();
}

function base64Encoder(str:string) {
  let encodedString = '';
  if (typeof(window) === 'undefined') {
    encodedString = Buffer.from(str).toString('base64');
  }
  else {
    encodedString = btoa(str);
  }
  return encodedString;
}

export const checkFetcher = () => {
  if (typeof fetch === 'undefined') {
    let library = 'unfetch';
    if (typeof window === 'undefined') library = 'node-fetch';
    throw new Error(`
  fetch is not found globally, to fix pass a fetch for
  your environment like https://www.npmjs.com/package/${library}.
  For example:
  import fetch from '${library}';`);
  }
  // try {
  //   const header = new Headers();
  // }
  // catch (e) {
  //   throw new Error(`
  // Headers not defined`);
  // }
};