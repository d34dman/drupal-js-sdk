import {Config} from '../Config';


test('Config', () => {
  const config = new Config({'FOO': 'bar'});
  expect(config.getItem('FOO')).toBe('bar');
  expect(config.get()).toEqual({FOO: 'bar'});
  expect(config.set({})).toBe(undefined);
  expect(config.get()).toEqual({});
  config.setItem('FOO', 'bar');
  config.setItem('FOO', 'bar');
  config.setItem('FOO', 'bar');
  config.setItem('FOO', 'bar');
  expect(config.get()).toEqual({FOO: 'bar'});
  config.setItem('AAA', 'BBB');
  expect(config.get()).toEqual({AAA: 'BBB', FOO: 'bar'});
  expect(config.removeItem('FOO')).toBe(undefined);
  expect(config.removeItem('BAZ')).toBe(undefined);
  expect(config.clear()).toBe(undefined);
  expect(config.get()).toEqual({});
  config.setItem('FOO', 'bar');
  expect(config.getItem('FOO')).toBe('bar');
});
