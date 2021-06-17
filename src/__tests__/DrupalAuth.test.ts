import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {Drupal} from '../';
import {DrupalAuth} from '../';

const mock = new MockAdapter(axios);

const mockData: {[key: string]: any;} = {
  login: {
    admin: {
      current_user: {uid: '1', roles: ['authenticated'], name: 'admin'},
      csrf_token: 'mock-session-token-from-login',
      logout_token: '8av5mgYDgJ7bKS2seVtIK3trLIuqsh4WycFL8w4qCKs',
    },
  },
  valid: {},
  register: {
    new_user: {uid: [{value: 19}], uuid: [{value: 'a02000bf-eff5-41f6-9a8d-f3cf3199dc2d'}], langcode: [{value: 'en'}], name: [{value: 'fooBar'}], created: [{value: '2021-05-26T20:16:26+00:00', format: 'Y-m-d\\TH:i:sP'}], changed: [{value: '2021-05-26T20:16:26+00:00', format: 'Y-m-d\\TH:i:sP'}], default_langcode: [{value: true}], user_picture: []},
  },
};

mock.onPost('/user/password').reply(200, '');
mock.onGet('/user/login_status').reply(200, 0);
mock.onGet('/session/token').reply(200, 'mock-session-token');
mock.onPost('/user/login').reply(200, mockData.login.admin);
mock.onPost('/user/logout').reply(204, '');
mock.onGet('/user/logout').reply(200, '');
mock.onPost('/user/register').reply(200, mockData.register.new_user);

test('Drupal Auth login and logout', async () => {
  const drupal = new Drupal().initialize({baseURL: 'http://example.com'});
  const auth = new DrupalAuth(drupal);
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
  const drupal = new Drupal().initialize({baseURL: 'http://example.com'});
  const auth = new DrupalAuth(drupal);
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
  const drupal = new Drupal().initialize({baseURL: 'http://example.com'});
  const auth = new DrupalAuth(drupal);
  await auth.getSessionToken();
  await auth.passwordResetByMail('admin@example.com').then((response) => {
    expect(response.status).toBe(200);
  });
  await auth.passwordResetByUserName('admin').then((response) => {
    expect(response.status).toBe(200);
  });
});

test('Drupal Auth register', async () => {
  const drupal = new Drupal().initialize({baseURL: 'http://example.com'});
  const auth = new DrupalAuth(drupal);
  await auth.getSessionToken();
  await auth
    .register('admin', 'admin@example.com')
    .then((response) => {
      expect(response.status).toBe(200);
    });
});
