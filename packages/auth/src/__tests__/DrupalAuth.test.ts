import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {Drupal} from '@drupal-js-sdk/core';
import {DrupalAuth} from '..';
import { StorageInMemory } from '@drupal-js-sdk/storage';
import { AxiosClient } from '@drupal-js-sdk/xhr';


const mock = new MockAdapter(axios);

const mockData: {[key: string]: any;} = {
  login: {
    admin: {
      current_user: {
        uid: '1', 
        roles: ['authenticated'], 
        name: 'admin'
      },
      csrf_token: 'mock-session-token-from-login',
      logout_token: '8av5mgYDgJ7bKS2seVtIK3trLIuqsh4WycFL8w4qCKs',
    },
  },
  valid: {},
  register: {
    newUser: {
      uid: [{value: 19}],
      uuid: [{value: 'a02000bf-eff5-41f6-9a8d-f3cf3199dc2d'}],
      langcode: [{value: 'en'}], name: [{value: 'fooBar'}],
      created: [{value: '2021-05-26T20:16:26+00:00',
        format: 'Y-m-d\\TH:i:sP'}],
      changed: [{value: '2021-05-26T20:16:26+00:00', format: 'Y-m-d\\TH:i:sP'}],
      default_langcode: [{value: true}], // eslint-disable-line @typescript-eslint/naming-convention
      user_picture: []}, // eslint-disable-line @typescript-eslint/naming-convention
  },
};

mock.onPost('/user/password').reply(200, '');
mock.onGet('/user/login_status').reply(200, 0);
mock.onGet('/session/token').reply(200, 'mock-session-token');
mock.onPost('/user/login').reply(200, mockData.login.admin);
mock.onPost('/user/logout').reply(204, '');
mock.onGet('/user/logout').reply(200, '');
mock.onPost('/user/register').reply(200, mockData.register.newUser);

test('Drupal Auth login and logout', async () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(axios);
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);
  await auth.getSessionToken();
  expect(auth.store.csrf_token).toEqual('mock-session-token');
  expect(await auth.loginStatus()).toEqual(false);
  expect.assertions(9);
  return auth
    .login('admin', 'admin')
    .then((response) => {
      expect(response.data).toHaveProperty('csrf_token');
      expect(response.data).toHaveProperty('current_user');
      expect(response.data).toHaveProperty('logout_token');
      expect(auth.store.csrf_token).toEqual(mockData.login.admin.csrf_token);
      expect(auth.store.current_user).toEqual(
        mockData.login.admin.current_user,
      );
      expect(auth.store.logout_token).toEqual(
        mockData.login.admin.logout_token,
      );
    })
    .then(async () => {
      const {status} = await auth.logout();
      expect(status).toEqual(204);
    });
});


test('Drupal Auth Forced logout', async () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(axios);
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);
  const status = await auth.forcedLogout();
  expect(status).toEqual(true);
  await auth.getSessionToken();
  expect.assertions(2);
  return auth
    .login('admin', 'admin')
    .then(async () => {
      const status = await auth.forcedLogout();
      expect(status).toEqual(true);
    });
});

test('Drupal Auth password reset', async () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(axios);
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);
  await auth.getSessionToken();
  await auth.passwordResetByMail('admin@example.com').then((response) => {
    expect(response.status).toBe(200);
  });
  await auth.passwordResetByUserName('admin').then((response) => {
    expect(response.status).toBe(200);
  });
});

test('Drupal Auth register', async () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(axios);
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);
  await auth.getSessionToken();
  await auth
    .register('admin', 'admin@example.com')
    .then((response) => {
      expect(response.status).toBe(200);
    });
});


test('Drupal Auth login with restore session', async () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(axios);
  sdk.setClientService(client);
  const sessionStorage = new StorageInMemory();
  sdk.setSessionService(sessionStorage);
  const auth = new DrupalAuth(sdk);
  await auth.getSessionToken();
  expect(auth.store.csrf_token).toEqual('mock-session-token');
  expect(await auth.loginStatus()).toEqual(false);
  await auth
    .login('admin', 'admin');
  expect(auth.store.current_user).toEqual(
    mockData.login.admin.current_user,
  );
  
  const sdk2 = new Drupal(config);
  sdk2.setSessionService(sessionStorage);
  
  const auth2 = new DrupalAuth(sdk);
  expect(auth2.store.current_user).toEqual(
    mockData.login.admin.current_user,
  );
});

