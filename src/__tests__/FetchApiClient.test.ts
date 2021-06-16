import {Drupal} from '../Drupal';
import {DrupalAuth} from '../DrupalAuth';
import {DrupalError} from '../DrupalError';
import FetchApiClient from '../FetchApiClient';
import NodeFetchApiClient from '../NodeFetchApiClient';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMock = require('node-fetch');

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

beforeEach(() => {
  fetchMock.mockIf(/^https?:\/\/example.com.*$/, (req: any) => {
    if (req.url.endsWith('/session/token')) {
      return Promise.resolve('mock-session-token');
    } else if (req.url.endsWith('/user/logout')) {
      return Promise.resolve({
        status: 204,
        body: '',
      });
    } else if (req.url.endsWith('/user/login_status?_format=json')) {
      return Promise.resolve({
        status: 200,
        body: 0,
      });
    } else if (req.url.endsWith('/user/login?_format=json')) {
      return Promise.resolve({
        status: 200,
        body: JSON.stringify(mockData.login.admin),
      });
    } else {
      return Promise.resolve({
        status: 403,
        body: '',
      });
    }
  });
});

test('config', () => {
  const config = {foo: 'bar'};
  const client = new FetchApiClient().addDefaultHeaders(config);
  expect(client.getConfig()).toEqual({headers: config});
  expect(new NodeFetchApiClient().getConfig()).toEqual({});
  expect(new FetchApiClient().getConfig()).toEqual({});
  expect(new FetchApiClient().setConfig(config).getConfig()).toEqual(config);
  expect(new NodeFetchApiClient().setConfig(config).getConfig()).toEqual(config);
});

test('Fetch client - node', () => {
  const sdk = new Drupal().initialize({
    baseURL: 'https://example.com',
  });
  const api = sdk.core.getApiClientService();
  expect(api.request('GET', '/user/logout', {})).toBeInstanceOf(Promise);
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
  expect(error.toString()).toBe('DrupalError: 100 Fetch method failed: "Foo"');
});


test('Fetch client - browser', () => {
  const sdk = new Drupal();
  sdk.core.set('IS_NODE', false);
  sdk.initialize({
    baseURL: 'https://example.com',
  });
  expect(sdk.core.getApiClientService()).toBeInstanceOf(FetchApiClient);

  sdk.core.getApiClientService().setClient('faker');
  expect(sdk.core.getApiClientService().getClient()).toBe('faker');
});

test('Drupal Auth login and logout', async () => {
  const sdk = new Drupal().initialize({
    baseURL: 'https://example.com',
  });
  const auth = new DrupalAuth(sdk);
  const foo = await auth.getSessionToken();
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
      expect(auth.store.current_user?.name ?? undefined).toEqual(
        mockData.login.admin.current_user.name,
      );
      expect(auth.store.logout_token).toEqual(
        mockData.login.admin.logout_token,
      );
    })
    .then(async () => {
      const status = await auth.forcedLogout();
      expect(status).toEqual(true);
    });
});
