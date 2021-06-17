import {DrupalSettings, DrupalRole, DrupalError} from '../';

test('Test for implemented methods', () => {
  const settings = new DrupalSettings();
  const role = new DrupalRole();
  expect(() => {settings.get('foo')}).toThrow(DrupalError);
  expect(() => {role.hasRole('foo')}).toThrow(DrupalError);
});
