/**
 * @jest-environment jsdom
 */
import { FetchClient } from '..';
import {XhrRequestConfig} from '@drupal-js-sdk/interfaces';

global.fetch = jest.fn(() =>
  Promise.resolve({
    data: JSON.stringify({ foo: 'bar' }),
    ok: 1,
    status: 200,
    statusText: 'ok',
    json: () => { return { foo: 'bar' } },
    headers: new Headers({bar: 'baz'}),
  }),
) as jest.Mock;


test.skip('setclient', async () => {
  const config = {
    baseURL: 'https://drupal-js-sdk-demo.d34dman.com',
  };
  const client = new FetchClient(config);
  const res = await client.call('GET', '/system/menu/main/linkset');
  expect(res.data).toEqual({ foo: 'bar' });
});


test('Basic Auth in web', async () => {
  const config: XhrRequestConfig = {
    baseURL: 'https://abc.example.com',
    withCredentials: true,
    auth: {
      username: 'foo',
      password: 'bar'
    }
  };
  const client = new FetchClient(config);
  const res1 = await client.call('GET', '/fake-path');
  expect(res1.request).toMatchObject({ headers: { Authorization: 'Basic Zm9vOmJhcg==' } });
});

test('Response Headers', async () => {
  const config: XhrRequestConfig = {baseURL: 'https://abc.example.com'};
  const client = new FetchClient(config);
  const res1 = await client.call('GET', '/fake-path');
  expect(res1.headers).toMatchObject({bar: 'baz'});
});
