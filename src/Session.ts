import {Config} from './Config';
import {
  ConfigInterface,
  ConfigRecordInterface,
  SessionInterface,
  StorageKeyType,
  StorageValueType,
} from './interfaces';

export class Session implements SessionInterface {
  protected config: ConfigInterface;
  constructor(config: ConfigRecordInterface) {
    this.config = new Config(config);
  }

  public getItem(key: StorageKeyType): StorageValueType {
    throw new Error('Method not implemented');
  }

  public setItem(keyName: StorageKeyType, keyValue: StorageValueType): boolean {
    throw new Error('Method not implemented');
  }

  public removeItem(keyName: StorageKeyType): boolean {
    throw new Error('Method not implemented');
  }

  public clear(): boolean {
    throw new Error('Method not implemented');
  }

}
