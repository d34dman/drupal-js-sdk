import {Drupal} from '..';

test('Drupal initialize', () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.config.setItem('FOO', 'bar');
  expect(sdk.config.getItem('FOO')).toBe('bar');
  expect(sdk.config.getItem('baseURL')).toBe(config.baseURL);
});
