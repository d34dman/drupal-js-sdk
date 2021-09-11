import {Session} from '../Session';


test('Session stub/unimplemented methods throws error', () => {
  const session = new Session({});
  expect(() => {session.setItem('FOO', 'BAR')}).toThrowError('Method not implemented');
  expect(() => {session.getItem('FOO')}).toThrowError('Method not implemented');
  expect(() => {session.removeItem('FOO')}).toThrowError('Method not implemented');
  expect(() => {session.clear()}).toThrowError('Method not implemented');
});
