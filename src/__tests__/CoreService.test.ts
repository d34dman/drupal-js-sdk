import {Drupal, Core, AxiosApiClient} from '..';


test('Core Service', () => {
  const core = new Core();
  core.set('FOO', 'bar');
  expect(core.get('FOO')).toBe('bar');
  expect(() => {
    core.get('BAR');
  }).toThrow('Configuration key not found: BAR');
  expect(() => {
    core.getApiClientService();
  }).toThrow('ApiClientService undefined');
  const client = new AxiosApiClient();
  expect(core.setApiClientService(client)).toBe(core);
  expect(core.getApiClientService()).toBe(client);
});
