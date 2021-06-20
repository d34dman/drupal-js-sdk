import {DrupalError} from '..';

test('Drupal initialize', () => {
  const error = new DrupalError(42, 'Solution');
  expect(error.toString()).toBe('DrupalError: 42 Solution');
  expect(error.getErrorCode()).toBe(42);
});
