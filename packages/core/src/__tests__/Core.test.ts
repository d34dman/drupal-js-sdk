import {Core} from '..';
import { StorageInMemory } from '@drupal-js-sdk/storage';
import axios from 'axios';
import {XhrClient} from '@drupal-js-sdk/xhr';
test('Core', () => {
  const core = new Core({});
  core.config.setItem('FOO', 'bar');
  expect(core.config.getItem('FOO')).toBe('bar');
  expect(core.config.getItem('BAR')).toBe(null);

});


test('Core Overridable Services', () => {
  const core = new Core({});

  expect(() => {
    core.getClientService();
  }).toThrow('ApiClientService undefined');

  const axiosClient = axios.create();
  const client = new XhrClient(axiosClient);
  expect(core.setClientService(client)).toBe(core);
  expect(core.getClientService()).toBe(client);

  expect(() => {
    core.getSessionService();
  }).toThrow('SessionService undefined');


  const session = new StorageInMemory();
  expect(core.setSessionService(session)).toBe(core);
  expect(core.getSessionService()).toBe(session);


  const config = new StorageInMemory();
  expect(core.setConfigService(config)).toBe(core);
  expect(core.getConfigService()).toBe(config);

});
