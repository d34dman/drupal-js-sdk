import { Drupal } from '../Drupal';
import { DrupalAuth } from '../DrupalAuth';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
var mock = new MockAdapter(axios);

const mockData: { [key: string]: any; } = {
  login: {
    admin: {
      current_user: { uid: '1', roles: ['authenticated'], name: 'admin' },
      csrf_token: 'mock-session-token-from-login',
      logout_token: '8av5mgYDgJ7bKS2seVtIK3trLIuqsh4WycFL8w4qCKs'
    }
  },
  valid: {},
};

mock.onPost("/user/password").reply(200, '');
mock.onGet("/user/login_status").reply(200, 0);
mock.onGet("/session/token").reply(200, 'mock-session-token');
mock.onPost("/user/login").reply(200, mockData.login.admin);
mock.onPost("/user/logout").reply(204, '');


test('Drupal Auth login and logout', async () => {
  const drupal = new Drupal().initialize({ baseURL: 'http://example.com' });
  const auth = new DrupalAuth(drupal);
  await auth.getSessionToken();
  expect(auth.store.csrf_token).toEqual('mock-session-token');
  expect(await auth.loginStatus()).toEqual(false);
  expect.assertions(9);
  return auth.login('admin', 'admin')
    .then((response) => {
      expect(response.data).toHaveProperty('csrf_token');
      expect(response.data).toHaveProperty('current_user');
      expect(response.data).toHaveProperty('logout_token');
      expect(auth.store.csrf_token).toEqual(mockData.login.admin.csrf_token);
      expect(auth.store.current_user).toEqual(mockData.login.admin.current_user);
      expect(auth.store.logout_token).toEqual(mockData.login.admin.logout_token);
    })
    .then(async () => {
      const {status} = await auth.logout();
      expect(status).toEqual(204);
    });
});

test('Drupal Auth password reset', async () => {
  const drupal = new Drupal().initialize({ baseURL: 'http://example.com' });
  const auth = new DrupalAuth(drupal);
  await auth.getSessionToken();
  await auth.passwordResetByMail('admin@example.com').then((response) => {
    expect(response.status).toBe(200);
  });
  await auth.passwordResetByUserName('admin').then((response) => {
    expect(response.status).toBe(200);
  });
});
