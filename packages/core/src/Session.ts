import {Config} from './Config';
import {
  ConfigInterface,
  ConfigRecordInterface,
  SessionInterface,
  StorageValueType,
} from './interfaces';

export class Session implements SessionInterface {
  public config: ConfigInterface;
  constructor(config: ConfigRecordInterface) {
    this.config = new Config(config);
  }

  public getItem(key: string): StorageValueType {
    if (key) {
      // @TODO Implement getItem.
    }
    throw new Error('Method not implemented');
  }

  public setItem(keyName: string, keyValue: StorageValueType): boolean {
    if (keyName && keyValue) {
      // @TODO Implement setItem.
    }
    throw new Error('Method not implemented');
  }

  public removeItem(keyName: string): boolean {
    if (keyName) {
      // @TODO Implement removeItem.
    }
    throw new Error('Method not implemented');
  }

  public clear(): boolean {
    throw new Error('Method not implemented');
  }

}
