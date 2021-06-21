import {Drupal} from '..';

test('Drupal initialize', () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.config.set('FOO', 'bar');
  expect(sdk.config.get('FOO')).toBe('bar');
  expect(sdk.config.get('baseURL')).toBe(config.baseURL);
});

test('Drupal initialize with headers', () => {
  const config = {
    baseURL: 'http://www.example.com',
    headers: {
      'X-Foo': 'Foo',
      'X-Bar': {foo: 'bar'},
      'X-Baz': true,
    },
  };
  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.config.set('FOO', 'bar');
  expect(sdk.config.get('FOO')).toBe('bar');
});

test('Drupal initialize with basic auth', () => {
  const config = {
    baseURL: 'http://www.example.com',
    auth: {
      username: 'dpa',
      password: 'dpa',
    },
  };
  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.config.set('FOO', 'bar');
  expect(sdk.config.get('FOO')).toBe('bar');
});
