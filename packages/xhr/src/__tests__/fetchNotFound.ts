import {FetchClient} from '..';

test('FetchClient throws error when fetch is not available', async () => {
  
  const config = {
    baseURL: 'https://drupal-js-sdk-demo.d34dman.com',
  };
  expect(() => {new FetchClient(config)}).toThrow();
});
