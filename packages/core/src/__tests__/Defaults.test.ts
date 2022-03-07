import {DrupalSettings, DrupalRole} from '..';
import {DrupalError} from '@drupal-js-sdk/error';

test('Test for implemented methods', () => {
  const settings = new DrupalSettings();
  const role = new DrupalRole();
  expect(() => {
    settings.get('foo');
  }).toThrow(DrupalError);
  expect(() => {
    role.hasRole('foo');
  }).toThrow(DrupalError);
});
