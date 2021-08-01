import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {AxiosClient, DrupalError} from '..';

const mock = new MockAdapter(axios);

mock.onGet('/mock-req').reply(200, 'Mock 200');
mock.onGet('/mock-err-500').reply(500, 'Mock 500');

test('Axios client', () => {
  const api = new AxiosClient();
  const client = axios.create();
  expect(api.setClient(client)).toBe(api);
  expect(api.getClient()).toBe(client);
  expect(api.call('GET', '/mock-req', {})).toBeInstanceOf(Promise);
  expect(api.getDrupalError('')).toBeInstanceOf(DrupalError);
  expect(api.getDrupalError({})).toBeInstanceOf(DrupalError);
  expect(api.getDrupalError({responseText: 'foo'})).toBeInstanceOf(
    DrupalError,
  );
  const errorInfo = JSON.stringify({
    code: 42,
    error: 'Answer',
  });
  let error = api.getDrupalError({responseText: errorInfo});
  expect(error.toString()).toBe('DrupalError: 42 Answer');

  error = api.getDrupalError({message: 'Foo'});
  expect(error.toString()).toBe('DrupalError: 100 Axios method failed: "Foo"');
});

test('Axios client error handling', async () => {
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
