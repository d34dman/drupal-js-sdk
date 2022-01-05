import {StorageInterface} from './interfaces';

export class Store implements StorageInterface {

    /**
     * When passed a key name, will return that key's value.
     */
  public getItem(keyName: string): string {
    if (keyName) {
      // @TODO Implement getItem.
    }
    throw new Error('Method not implemented');
  }

    /**
     * When passed a key name and value, will add that key to the storage,
     * or update that key's value if it already exists.
     */
  public setItem(keyName: string, keyValue: string): boolean {
    if (keyName && keyValue) {
      // @TODO Implement setItem.
    }
    throw new Error('Method not implemented');
  }

    /**
     * When passed a key name, will remove that key from the storage.
     */
  public removeItem(keyName: string): boolean {
    if (keyName) {
      // @TODO Implement removeItem.
    }
    throw new Error('Method not implemented');
  }

    /**
     * When invoked, will empty all keys out of the storage.
     */
  public clear(): boolean {
    return false;
  }
}
