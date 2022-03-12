import {FetchClient} from '..';


global.fetch = jest.fn(() =>
  Promise.resolve({
    data: JSON.stringify({}),
    ok: 1,
    status: 200,
    statusText: 'ok',
    json: () => {throw new Error('foo')},
  }),
) as jest.Mock;


test('setclient', async () => {
    const config = {
      baseURL: 'https://drupal-js-sdk-demo.d34dman.com',
    };
    const client = new FetchClient(config);
    expect.assertions(1);
    await expect(client.call('GET', '/system/menu/main/linkset')).rejects.toThrow();
  });
  