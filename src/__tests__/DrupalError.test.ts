import {DrupalError} from '../DrupalError';

test('Drupal initialize', () => {
  const error = new DrupalError(42, 'Solution');
  expect(error.toString()).toBe('DrupalError: 42 Solution');
});
