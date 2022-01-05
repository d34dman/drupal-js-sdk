import {Core, AxiosClient} from '..';
import {Session} from '../Session';

test('Core', () => {
  const core = new Core({});
  core.config.setItem('FOO', 'bar');
  expect(core.config.getItem('FOO')).toBe('bar');
  expect(() => {
    core.config.getItem('BAR');
  }).toThrow('Configuration key not found: BAR');

});


test('Core Overridable Services', () => {
  const core = new Core({});

  expect(() => {
    core.getClient();
  }).toThrow('ApiClientService undefined');

  const client = new AxiosClient();
  expect(core.setClient(client)).toBe(core);
  expect(core.getClient()).toBe(client);

  expect(() => {
    core.getSessionService();
  }).toThrow('SessionService undefined');


  const session = new Session({});
  expect(core.setSessionService(session)).toBe(core);
  expect(core.getSessionService()).toBe(session);
});
