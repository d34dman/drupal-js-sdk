import {DrupalError} from '@drupal-js-sdk/error';

export class DrupalRole {
  public hasRole(role: string): boolean {
    if (role) {
      // @TODO Implement role check.
    }
    throw new DrupalError(DrupalError.MISSING_IMPLEMENTATION_ERROR, 'Not Implemented');
  }
}
