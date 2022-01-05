import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {AxiosClient, DrupalError} from '..';

const mock = new MockAdapter(axios);

mock.onGet('/mock-req').reply(200, 'Mock 200');
mock.onGet('/mock-err-proper-response').reply(500, 'Mock 500');
mock.onGet('/mock-err-proper-response').reply(403, {responseText: JSON.stringify(true)});

test('Axios client', () => {
  const api = new AxiosClient();
  const client = axios.create();
  expect(api.setClient(client)).toBe(api);
  expect(api.getClient()).toBe(client);
  expect(api.call('GET', '/mock-req', {})).toBeInstanceOf(Promise);
  api.addDefaultHeaders({foo: 'bar'});
  expect(api.client.defaults.headers).toHaveProperty('foo', 'bar');
});


test('Axios client response handler', () => {
  const api = new AxiosClient();
  let mockResponseGenerator = function (data?: undefined|number|boolean|string|{[key: string]: any;} ) {
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
  expect(api.getDrupalError(mockResponseGenerator('Foo'))).toBeInstanceOf(
    DrupalError,
  );
  const errorInfo = JSON.stringify({
    code: 42,
    error: 'Answer',
  });
  let error = api.getDrupalError(mockResponseGenerator({responseText: errorInfo}));
  expect(error.toString()).toBe('DrupalError: 42 Answer');

  error = api.getDrupalError(mockResponseGenerator({message: 'Foo'}));
  expect(error.toString()).toBe('DrupalError: 100 Axios method failed: {\"message\":\"Foo\"}');

  error = api.getDrupalError(mockResponseGenerator({responseText: 'Invalid JSON'}));
  expect(error.toString()).toBe('DrupalError: 107 Received an error with invalid JSON from Drupal: Invalid JSON');

  error = api.getDrupalError(mockResponseGenerator({responseText: 1337}));
  expect(error.toString()).toBe('DrupalError: 107 Received an error with invalid JSON from Drupal: 1337');
});


test('Axios client error - 500 response', async () => {
  const api = new AxiosClient();
  const client = axios.create();
  expect(api.setClient(client)).toBe(api);
  expect(api.getClient()).toBe(client);
  expect.assertions(3);
  await api
    .call('GET', '/mock-err-500', {})
    .catch((err) => {
      expect(err).toBeInstanceOf(DrupalError);
    });
});

test('Axios client error - proper json response', async () => {
  const api = new AxiosClient();
  const client = axios.create();
  expect(api.setClient(client)).toBe(api);
  expect(api.getClient()).toBe(client);
  expect.assertions(3);
  await api
    .call('GET', '/mock-err-proper-response', {})
    .catch((err) => {
      expect(err).toBeInstanceOf(DrupalError);
    });
});
