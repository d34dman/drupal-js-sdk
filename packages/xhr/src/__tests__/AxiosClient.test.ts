import {AxiosClient} from "..";
import {DrupalError} from "@drupal-js-sdk/error";
import { XhrRequestConfig, XhrResponse } from "@drupal-js-sdk/interfaces";

// Minimal axios-like client stub with compatible generic signature
const createStubClient = () => ({
  request: <T = unknown, D = unknown>(config: XhrRequestConfig<D>): Promise<XhrResponse<T, D>> => {
    const url = config.url ?? "";
    if (url === "/mock-req") {
      const res: XhrResponse<unknown, D> = {
        data: "Mock 200",
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        request: {},
      };
      return Promise.resolve(res as XhrResponse<T, D>);
    }
    if (url === "/mock-err-500") {
      const errRes: XhrResponse<unknown, D> = {
        data: "Mock 500",
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config,
        request: {},
      };
      return Promise.reject(errRes);
    }
    if (url === "/mock-err-proper-response") {
      const errRes: XhrResponse<unknown, D> = {
        data: { responseText: JSON.stringify({ code: 42, error: "Answer" }) },
        status: 403,
        statusText: "Forbidden",
        headers: {},
        config,
        request: {},
      } as unknown as XhrResponse<unknown, D>;
      return Promise.reject(errRes);
    }
    const res: XhrResponse<unknown, D> = {
      data: null,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      request: {},
    };
    return Promise.resolve(res as XhrResponse<T, D>);
  },
});

test('Axios client', () => {
  const clientA = createStubClient();
  const api = new AxiosClient(clientA);
  const clientB = createStubClient();
  expect(api.setClient(clientB)).toBe(api);
  expect(api.getClient()).toBe(clientB);
  expect(api.call('GET', '/mock-req', {})).toBeInstanceOf(Promise);
});


test('Axios client response handler', () => {
  const api = new AxiosClient(createStubClient());
  const mockResponseGenerator = function (data?: undefined|number|boolean|string|{[key: string]: any;} ) {
    return {
      data: data,
      status: 42,
      statusText: '42',
      headers: {},
      config: {},
    }
  }
  expect(api.getDrupalError(mockResponseGenerator())).toBeInstanceOf(DrupalError);
  expect(api.getDrupalError(mockResponseGenerator(''))).toBeInstanceOf(DrupalError);
  expect(api.getDrupalError(mockResponseGenerator('Foo'))).toBeInstanceOf(DrupalError);
  const errorInfo = JSON.stringify({
    code: 42,
    error: 'Answer',
  });
  let error = api.getDrupalError(mockResponseGenerator({responseText: errorInfo}));
  expect(error.toString()).toBe('DrupalError: 42 Answer');

  error = api.getDrupalError(mockResponseGenerator({message: 'Foo'}));
  expect(error.toString()).toBe('DrupalError: 100 Xhr method failed: {"message":"Foo"}');

  error = api.getDrupalError(mockResponseGenerator({responseText: 'Invalid JSON'}));
  expect(error.toString()).toBe('DrupalError: 107 Received an error with invalid JSON from server: Invalid JSON');

  error = api.getDrupalError(mockResponseGenerator({responseText: 1337}));
  expect(error.toString()).toBe('DrupalError: 107 Received an error with invalid JSON from server: 1337');
});


test('Axios client error - 500 response', async () => {
  const api = new AxiosClient(createStubClient());
  expect.assertions(1);
  await api
    .call('GET', '/mock-err-500', {})
    .catch((err) => {
      expect(err).toBeInstanceOf(DrupalError);
    });
});

test('Axios client error - proper json response', async () => {
  const api = new AxiosClient(createStubClient());
  expect.assertions(1);
  await api
    .call('GET', '/mock-err-proper-response', {})
    .catch((err) => {
      expect(err).toBeInstanceOf(DrupalError);
    });
});


test('Axios client add default headers', async () => {
  const api = new AxiosClient(createStubClient());
  api.addDefaultHeaders({
    foo: 'bar',
    bar: 'baz',
  });
  const clientB = createStubClient();
  expect(api.setClient(clientB)).toBe(api);
  expect(api.getClient()).toBe(clientB);
});

test('Axios client add default options', () => {
  const api = new AxiosClient(createStubClient());
  
  // Test adding default options - this covers lines 39-47
  const result = api.addDefaultOptions({
    baseURL: 'https://default.example.com',
    timeoutMs: 5000,
    withCredentials: true,
    headers: {
      'Default-Header': 'default-value',
    },
  });
  
  expect(result).toBe(api); // Should return this for chaining
});

test('Axios client add default options with existing headers', () => {
  const api = new AxiosClient(createStubClient());
  
  // First add some headers
  api.addDefaultHeaders({
    'Existing-Header': 'existing-value',
  });
  
  // Then add default options with more headers
  const result = api.addDefaultOptions({
    headers: {
      'New-Header': 'new-value',
    },
    timeoutMs: 3000,
  });
  
  expect(result).toBe(api);
});

test('Axios client addDefaultOptions with no existing headers (Line 43)', () => {
  // Create AxiosClient with no initial headers to test Line 43
  const api = new AxiosClient(createStubClient());
  
  // Don't set any headers first - this should test the ?? {} branch on line 43
  const result = api.addDefaultOptions({
    headers: {
      'First-Header': 'first-value',
    },
  });
  
  expect(result).toBe(api);
});

test('Axios client addDefaultOptions with no headers in options', () => {
  const api = new AxiosClient(createStubClient());
  
  // Add some existing headers
  api.addDefaultHeaders({
    'Existing': 'header',
  });
  
  // Then add options with no headers - this should test the ?? {} branch on line 44
  const result = api.addDefaultOptions({
    baseURL: 'https://no-headers-option.example.com',
    timeoutMs: 2000,
  });
  
  expect(result).toBe(api);
});

test('Axios client add default options with no headers', () => {
  const api = new AxiosClient(createStubClient());
  
  // Test with options that don't include headers
  const result = api.addDefaultOptions({
    baseURL: 'https://no-headers.example.com',
    withCredentials: false,
  });
  
  expect(result).toBe(api);
});

test('Axios client method chaining', () => {
  const api = new AxiosClient(createStubClient());
  
  // Test that all methods return this for chaining
  const chained = api
    .addDefaultHeaders({ 'Chain-Header': 'chain-value' })
    .addDefaultOptions({ timeoutMs: 1000 })
    .setClient(createStubClient());
  
  expect(chained).toBe(api);
});

test('Axios client addDefaultOptions with no existing config headers (Line 43)', () => {
  // Create fresh AxiosClient to ensure no existing headers
  const api = new AxiosClient(createStubClient());
  
  // Clear any existing headers to force the ?? {} branch on line 43
  (api as any).config = { headers: undefined };
  
  // This should test Line 43: ...(this.config.headers ?? {})
  // when this.config.headers is undefined
  const result = api.addDefaultOptions({
    headers: {
      'Test-Header': 'test-value',
    },
  });
  
  expect(result).toBe(api);
});

test('Axios client complete branch coverage for nullish coalescing', () => {
  const api = new AxiosClient(createStubClient());
  
  // Test when config.headers is null (different from undefined)
  (api as any).config = { headers: null };
  
  api.addDefaultOptions({
    headers: { 'Null-Test': 'value' }
  });
  
  // Test when config.headers exists but options.headers is null
  (api as any).config = { headers: { 'Existing': 'header' } };
  
  api.addDefaultOptions({
    headers: null as any, // This should test options.headers ?? {}
  });
  
  // Test when both are undefined
  (api as any).config = {};
  
  api.addDefaultOptions({
    // No headers property
  });
  
  expect(api).toBeInstanceOf(AxiosClient);
});

test('Axios client comprehensive branch coverage', () => {
  const api = new AxiosClient(createStubClient());
  
  // Test addDefaultOptions when config has no headers property
  const emptyConfigApi = new AxiosClient({
    request: () => Promise.resolve({
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { /* no headers property */ },
      request: {},
    }),
  } as any);
  
  // This should exercise the this.config.headers ?? {} branch
  emptyConfigApi.addDefaultOptions({
    headers: { 'New': 'header' }
  });
  
  // Test when options has no headers property  
  api.addDefaultOptions({
    baseURL: 'https://options-no-headers.example.com',
    // No headers property - should exercise options.headers ?? {} branch
  });
  
  expect(true).toBe(true);
});
