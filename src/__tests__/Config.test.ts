import {Config} from '../Config';


test('Config', () => {
  const config = new Config({});
  config.set('FOO', 'bar');
  expect(config.getType()).toBe('config');
  expect(config.get('FOO')).toBe('bar');
  expect(config.getConfig()).toEqual({FOO: 'bar'});
  expect(config.setConfig({})).toBe(config);
  expect(config.getConfig()).toEqual({});
  config.set('FOO', 'bar');
  config.set('FOO', 'bar');
  config.set('FOO', 'bar');
  config.set('FOO', 'bar');
  expect(config.getConfig()).toEqual({FOO: 'bar'});
  config.set('AAA', 'BBB');
  expect(config.getConfig()).toEqual({AAA: 'BBB', FOO: 'bar'});
});
