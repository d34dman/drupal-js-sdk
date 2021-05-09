import {Drupal} from '../Drupal';

test('Drupal initialize', () => {
  const sdk = new Drupal();
  const config = {
    baseURL: 'http://www.example.com',
  };
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.core.set('FOO', 'bar');
  expect(sdk.core.get('FOO')).toBe('bar');
});

test('Drupal initialize with headers', () => {
  const sdk = new Drupal();
  const config = {
    baseURL: 'http://www.example.com',
    headers: {
      'X-Foo': 'Foo',
      'X-Bar': {foo: 'bar'},
      'X-Baz': true,
    },
  };
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.core.set('FOO', 'bar');
  expect(sdk.core.get('FOO')).toBe('bar');
});

test('Drupal initialize with basic auth', () => {
  const sdk = new Drupal();
  const config = {
    baseURL: 'http://www.example.com',
    auth: {
      username: 'dpa',
      pass: 'dpa',
    },
  };
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.core.set('FOO', 'bar');
  expect(sdk.core.get('FOO')).toBe('bar');
});
