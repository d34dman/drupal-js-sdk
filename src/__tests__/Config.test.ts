import {Config} from '../Config';


test('Config', () => {
  const config = new Config({});
  config.setItem('FOO', 'bar');
  expect(config.getType()).toBe('config');
  expect(config.getItem('FOO')).toBe('bar');
  expect(config.getConfig()).toEqual({FOO: 'bar'});
  expect(config.setConfig({})).toBe(config);
  expect(config.getConfig()).toEqual({});
  config.setItem('FOO', 'bar');
  config.setItem('FOO', 'bar');
  config.setItem('FOO', 'bar');
  config.setItem('FOO', 'bar');
  expect(config.getConfig()).toEqual({FOO: 'bar'});
  config.setItem('AAA', 'BBB');
  expect(config.getConfig()).toEqual({AAA: 'BBB', FOO: 'bar'});
  expect(config.removeItem('FOO')).toBe(true);
  expect(config.removeItem('BAZ')).toBe(true);
  expect(config.clear()).toBe(true);
  expect(config.getConfig()).toEqual({});
  config.setItem('FOO', 'bar');
  expect(config.getType()).toBe('config');
  expect(config.getItem('FOO')).toBe('bar');  
});
