import { DrupalError } from "./";

export class DrupalRole {
  public hasRole(role: string): boolean {
    throw new DrupalError(DrupalError.MISSING_IMPLEMENTATION_ERROR, 'Not Implemented');
  }
}
