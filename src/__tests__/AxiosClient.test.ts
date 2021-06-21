import axios from 'axios';

import {AxiosClient, DrupalError} from '..';


test('Axios client', () => {
  const api = new AxiosClient();
  const client = axios.create();
  expect(api.setClient(client)).toBe(api);
  expect(api.getClient()).toBe(client);
  expect(api.call('GET', 'https://localhost', {})).toBeInstanceOf(Promise);
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
