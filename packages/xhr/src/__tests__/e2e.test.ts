import { AxiosClient } from '..';
import fetch from 'cross-fetch';
import { FetchClient } from '..';
global.fetch = fetch;

test.skip('Drupal Menu fetch request', async () => {

    const config = {
        baseURL: 'https://drupal-js-sdk-demo.d34dman.com',
    };
    const client = new FetchClient(config);
    const res1 = await client.call('GET', '/system/menu/main/linkset');
    expect(res1.request.path).toEqual('https://drupal-js-sdk-demo.d34dman.com/system/menu/main/linkset');

    const axiosClient = new AxiosClient({
        request: (cfg: any) => {
            return Promise.resolve({
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: cfg,
                request: {}
            });
        }
    } as any);
    const res2 = await axiosClient.call('GET', '/system/menu/main/linkset');

    expect(res2.data).toEqual(res1.data);
    
    axiosClient.addDefaultHeaders({
        foo: 'bar',
        bar: 'baz',
      });
    const res3 = await axiosClient.call('GET', '/system/menu/main/linkset');
    expect(res3.config.headers).toMatchObject({foo: 'bar'});
    expect(res3.config.headers).toMatchObject({bar: 'baz'});
});
