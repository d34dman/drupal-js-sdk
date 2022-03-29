import {DrupalRole} from '..';
import {DrupalError} from '@drupal-js-sdk/error';

test('Drupal Role : Test for un-implemented thing to throw', () => {
  const role = new DrupalRole();
  expect(() => {
    role.hasRole('foo');
  }).toThrow(DrupalError);
});
