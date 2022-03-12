import {FetchClient} from '..';
import {XhrRequestConfig} from '@drupal-js-sdk/interfaces';

const fakeData = {'foo': 'bar'};

global.fetch = jest.fn(() =>
  Promise.resolve({
    data: JSON.stringify(fakeData),
    ok: 1,
    status: 200,
    statusText: 'ok',
    json: () => Promise.resolve(fakeData),
  }),
) as jest.Mock;

test('Default', async () => {
  
  const config = {
    baseURL: 'https://drupal-js-sdk-demo.d34dman.com',
  };
  const client = new FetchClient(config);
  const res1 = await client.call('GET', '/system/menu/main/linkset');
  expect(res1.data).toEqual(fakeData);
  expect(res1.request.path).toEqual('https://drupal-js-sdk-demo.d34dman.com/system/menu/main/linkset');
  
  const axiosClient = new FetchClient();
  const config2 = {
    baseURL: 'https://umami.swis.nl',
  };
  const res2 = await axiosClient.call('GET', '/system/menu/main/linkset', config2);

  expect(res2.data).toEqual(fakeData);
  expect(res2.request.path).toEqual('https://umami.swis.nl/system/menu/main/linkset');
});

test('Identify and set path for the request.', async () => {
    
  const config = {
    baseURL: 'https://abc.example.com',
  };
  const client = new FetchClient(config);
  const res1 = await client.call('GET', '/system/menu/main/linkset');
  expect(res1.request.path).toEqual('https://abc.example.com/system/menu/main/linkset');
  
   
  const config2 = {};
  const client2 = new FetchClient(config2);
  const res2 = await client2.call('GET', '/system/menu/main/linkset');
  expect(res2.request.path).toEqual('/system/menu/main/linkset');
  
  const config3 = {
    baseURL: 'https://abc.example.com',
  };
  const client3 = new FetchClient(config3);
  
  const res3 = await client3.call('GET', '');
  
  expect(res3.request.path).toEqual('https://abc.example.com');

  const config4 = {
    baseURL: 'https://abc.example.com',
  };
  const client4 = new FetchClient(config4);
  const res4 = await client4.call('GET', 'https://xyz.example.com');
  expect(res4.request.path).toEqual('https://xyz.example.com');


  const config5 = {};
  const client5 = new FetchClient(config5);
  const res5 = await client5.call('GET', 'https://xyz.example.com');
  expect(res5.request.path).toEqual('https://xyz.example.com');
});

test('Add Headers', async () => {
  const config = {
    baseURL: 'https://drupal-js-sdk-demo.d34dman.com',
  };
  const client = new FetchClient(config);
  expect(client.getClient()).toBe(fetch);
  expect(client.addDefaultHeaders({foo: 'bar', bar: 'baz'})).toBe(client);
  const response = await client.call('GET', '/system/menu/main/linkset');
  expect(response.config.headers).toMatchObject({foo: 'bar', bar: 'baz'});
});


test('With Credentials', async () => {
  const config = {
    baseURL: 'https://abc.example.com',
    withCredentials: true
  };
  const client = new FetchClient(config);
  const res1 = await client.call('GET', '/system/menu/main/linkset');
  expect(res1.request.path).toEqual('https://abc.example.com/system/menu/main/linkset');
  expect(res1.request).toMatchObject({credentials: 'include'});
});

test('Basic Auth in node env', async () => {  
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
  expect(res1.request).toMatchObject({headers: { Authorization: 'Basic Zm9vOmJhcg==' }});
});
