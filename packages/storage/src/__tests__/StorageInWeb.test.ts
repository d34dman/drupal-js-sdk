/**
 * @jest-environment jsdom
 */

import { DrupalError } from '@drupal-js-sdk/error';
import { StorageInWeb } from '../StorageInWeb';

test('StorageInWeb', () => {
  const storage = new StorageInWeb(() => window.localStorage);
  storage.setItem('FOO', 'BAR');
  expect(storage.getItem('FOO')).toBe('BAR');
  storage.setItem('BAR', 'BAZ');
  expect(storage.getItem('BAR')).toBe('BAZ');
  storage.setItem('FOO', 'BAZ');
  expect(storage.getItem('FOO')).toBe('BAZ');
  storage.removeItem('FOO');
  expect(storage.getItem('FOO')).toBe(null);
  storage.clear();
  expect(storage.getItem('FOO')).toBe(null);
  expect(storage.get()).toEqual({});
  const testData = {'LIFE': 'WHAT?', 'Answer': 42};
  expect(storage.set(testData));
  expect(storage.get()).toEqual(testData);
});


test('StorageInWeb - localStorage', () => {
  const storage = new StorageInWeb(() => window.localStorage);
  storage.setItem('FOO', 'BAR');
  expect(storage.getItem('FOO')).toBe('BAR');
  
  const testData = {'LIFE': 'WHAT?', 'Answer': 42};
  const expectedData = {'FOO': 'BAR', 'LIFE': 'WHAT?', 'Answer': 42};
  
  expect(storage.set(testData));
  expect(storage.getItem('FOO')).toBe('BAR');

  expect(storage.get()).toEqual(expectedData);

  storage.clear();
  expect(storage.set(testData));
  expect(storage.get()).toEqual(testData);
});



test('StorageInWeb Errors', () => {
  const storage = new StorageInWeb();
  expect(storage.isAvailable()).toBe(true);
  jest.spyOn(storage, 'setString').mockImplementation();
  expect(storage.isAvailable()).toBe(false);
  jest.clearAllMocks();
  jest
    .spyOn(StorageInWeb.prototype, 'setString')
    .mockImplementation(() => {throw new Error('FOO')});
  try {
    new StorageInWeb();
  } 
  catch (error) {
    expect(error).toBeInstanceOf(DrupalError);
  }
  expect.assertions(3);
  jest.clearAllMocks();
});
