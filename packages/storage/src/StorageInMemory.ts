import { DrupalError } from "@drupal-js-sdk/error";

import {
  StorageInterface,
  StorageRecordInterface,
  StorageValueType,
} from "@drupal-js-sdk/interfaces";

export class StorageInMemory implements StorageInterface {
  protected data: { [key: string]: StorageValueType } = {};

  constructor() {
    if (this.isAvailable() === false) {
      throw new DrupalError(DrupalError.STORAGE_IN_MEMORY_FAIL, "Storage is not available.");
    }
  }

  public getString(keyName: string): string | null {
    return this.getItem(keyName);
  }

  public setString(keyName: string, keyValue: string): void {
    this.setItem(keyName, keyValue);
  }

  public isAvailable(): boolean {
    try {
      const test_string = "__test_data_used_for_checking_storage__";
      this.setString(test_string, test_string);
      const isAvailable = this.getString(test_string) === test_string;
      this.removeItem(test_string);
      return isAvailable;
    } catch (e) {
      return false;
    }
  }

  /**
   * When passed a key name, will return that key's value.
   */
  public getItem(keyName: string): StorageValueType {
    const value = this.data[keyName];
    return value === undefined ? null : this.data[keyName];
  }

  /**
   * When passed a key name and value, will add that key to the storage,
   * or update that key's value if it already exists.
   */
  public setItem(keyName: string, keyValue: StorageValueType): void {
    this.data[keyName] = keyValue;
  }

  /**
   * When passed a key name, will remove that key from the storage.
   */
  public removeItem(keyName: string): void {
    delete this.data[keyName];
  }

  /**
   * When invoked, will empty all keys out of the storage.
   */
  public clear(): void {
    this.set({});
  }

  public get(): StorageRecordInterface {
    return this.data;
  }

  public set(data: StorageRecordInterface): void {
    this.data = data;
  }
}
