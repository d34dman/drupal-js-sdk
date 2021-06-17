import { DrupalError } from "./DrupalError";

export class DrupalSettings {
  public get(key: string): any {
    throw new DrupalError(DrupalError.MISSING_IMPLEMENTATION_ERROR, 'Not Implemented');
  }
}
