import {XhrInterface, XhrRequestConfig, XhrResponse, XhrMethod, XhrQueryParams} from '@drupal-js-sdk/interfaces';
import {StorageRecordInterface} from '@drupal-js-sdk/interfaces';
import {Client} from './Client';

type FetchFunctionType = (input: any, init?: any) => Promise<Response>;
export class FetchClient extends Client implements XhrInterface {
  protected client: FetchFunctionType;
  protected config: StorageRecordInterface;
  private originalClient: FetchFunctionType;

  constructor(config: StorageRecordInterface = {}) {
    super();
    checkFetcher();
    this.config = config;
    // Bind global fetch to avoid "Illegal invocation" in some environments where
    // an unbound reference to fetch loses its global this context.
    const g: any = (typeof window !== 'undefined') ? window : (typeof globalThis !== 'undefined' ? globalThis : undefined);
    const globalFetch: FetchFunctionType = (g && typeof g.fetch === 'function') ? g.fetch : fetch;
    this.client = globalFetch.bind(g ?? globalThis);
    this.originalClient = globalFetch;
  }

  public setClient(fetchClient:FetchFunctionType = fetch): XhrInterface {
    // Respect custom client but bind if it's the global fetch to ensure correct this.
    const isGlobalFetch = (fetchClient === fetch) || (typeof window !== 'undefined' && fetchClient === window.fetch);
    if (isGlobalFetch) {
      const g: any = (typeof window !== 'undefined') ? window : (typeof globalThis !== 'undefined' ? globalThis : undefined);
      const globalFetch: FetchFunctionType = (g && typeof g.fetch === 'function') ? g.fetch : fetchClient;
      this.client = globalFetch.bind(g ?? globalThis);
      this.originalClient = globalFetch;
    } else {
      this.client = fetchClient;
      this.originalClient = fetchClient;
    }
    return this;
  }

  public getClient() {
    // Return the unbound/original client for identity checks in tests and consumers.
    return this.originalClient;
  }

  public addDefaultHeaders(headers: StorageRecordInterface): XhrInterface {
    this.config.headers = {
      ...this.config.headers,
      ...headers
    }
    return this;
  }

  public addDefaultOptions(options: Partial<XhrRequestConfig>): XhrInterface {
    this.config = {
      ...this.config,
      ...options,
      headers: {
        ...(this.config.headers ?? {}),
        ...(options.headers ?? {}),
      }
    };
    return this;
  }

  public call(
    method: XhrMethod,
    path: string,
    config?: XhrRequestConfig,
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
    const args: any = {
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
    // Pass through mode/cache if provided
    if (reqConfig.mode) (args as any).mode = reqConfig.mode;
    if (reqConfig.cache) (args as any).cache = reqConfig.cache;
    // Attach request body when provided
    if (typeof reqConfig.data !== 'undefined') {
      const existingCT = (args.headers as any)["Content-Type"] || (args.headers as any)["content-type"] || '';
      const contentType = String(existingCT).toLowerCase();
      const data: unknown = (reqConfig as any).data;
      // Heuristics: preserve FormData/Blob/ArrayBuffer/URLSearchParams; stringify plain objects when JSON
      const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
      const isURLSearchParams = typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams;
      const isBlob = typeof Blob !== 'undefined' && data instanceof Blob;
      const isArrayBuffer = typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer;
      const isArrayBufferView = typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(data as ArrayBufferView);
      const isReadableStream = typeof ReadableStream !== 'undefined' && data instanceof ReadableStream;
      if (isFormData || isURLSearchParams || isBlob || isArrayBuffer || isArrayBufferView || isReadableStream) {
        (args as any).body = data;
        // Let browser set correct content-type, remove any manual JSON type
        if (contentType.includes('application/json')) {
          delete (args.headers as any)["Content-Type"];
        }
      } else if (typeof data === 'string') {
        (args as any).body = data;
      } else {
        // Default: JSON encode plain objects
        (args as any).body = JSON.stringify(data);
        if (!contentType.includes('application/json')) {
          (args.headers as any)["Content-Type"] = 'application/json';
        }
      }
    }
    // Append query params if provided
    if (reqConfig.params) {
      const q = serializeQueryParams(reqConfig.params);
      if (q.length > 0) {
        const joiner = path.includes('?') ? '&' : '?';
        path = `${path}${joiner}${q}`;
      }
    }
    // Support AbortSignal and timeout
    const controller = !reqConfig.signal ? new AbortController() : undefined;
    if (!args.signal) args.signal = reqConfig.signal ?? controller?.signal;
    let timeoutHandle: any;
    if (typeof reqConfig.timeoutMs === 'number' && controller) {
      timeoutHandle = setTimeout(() => controller.abort(), reqConfig.timeoutMs);
    }
    const attemptFetch = async (): Promise<Response> => {
      try {
        return await (this.client as any)(path, args);
      } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle);
      }
    };
    const executeWithRetry = async (): Promise<Response> => {
      const retryCfg = reqConfig.retry;
      if (!retryCfg || retryCfg.retries <= 0) return attemptFetch();
      const retryOn = new Set(retryCfg.retryOn ?? [429, 503]);
      const factor = retryCfg.factor ?? 2;
      const minT = retryCfg.minTimeoutMs ?? 250;
      const maxT = retryCfg.maxTimeoutMs ?? 4000;
      let tries = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          const res = await attemptFetch();
          if (!res.ok && retryOn.has(res.status) && tries < retryCfg.retries) {
            const wait = Math.min(minT * Math.pow(factor, tries), maxT);
            await new Promise((r) => setTimeout(r, wait));
            tries += 1;
            continue;
          }
          return res;
        } catch (e) {
          if (tries >= retryCfg.retries) throw e;
          const wait = Math.min(minT * Math.pow(factor, tries), maxT);
          await new Promise((r) => setTimeout(r, wait));
          tries += 1;
        }
      }
    };
    // For safe methods, avoid sending CSRF header to prevent CORS preflight on some servers
    const methodLower = String(args.method ?? '').toLowerCase();
    if ((methodLower === 'get' || methodLower === 'head') && args.headers) {
      const h = args.headers as any;
      if (typeof h['X-CSRF-Token'] !== 'undefined') {
        delete h['X-CSRF-Token'];
      }
    }

    return executeWithRetry()
      .then(async (response: Response) => {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        const data = await parseResponseData(response);
        let responseHeaders = {};
        if (response.headers) {
          responseHeaders = Object.fromEntries(response.headers.entries())
        }
        // Capture ETag for conditional requests
        const etag = (responseHeaders as any)['etag'] || (responseHeaders as any)['ETag'];
        if (etag) {
          (args.headers as any)['If-None-Match'] = etag;
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
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => append(key, v));
      return;
    }
    append(key, value);
  });
  return usp.toString();
}

async function parseResponseData(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  const contentTypeRaw = (response.headers && typeof response.headers.get === "function")
    ? (response.headers.get("content-type") ?? "")
    : "";
  const contentType = contentTypeRaw.toLowerCase();
  const canJson = typeof (response as any).json === "function";
  const canText = typeof (response as any).text === "function";
  if (contentType.includes("json") || (!contentType && canJson)) {
    // Treat unknown content type as JSON to preserve previous behavior; let errors bubble
    return await (response as any).json();
  }
  if (canText) {
    return await (response as any).text();
  }
  return null;
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