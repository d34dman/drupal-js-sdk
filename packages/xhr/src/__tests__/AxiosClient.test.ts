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
