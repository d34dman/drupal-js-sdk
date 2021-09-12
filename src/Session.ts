import {Config} from './Config';
import {
  ConfigInterface,
  ConfigRecordInterface,
  SessionInterface,
  StorageValueType,
} from './interfaces';

export class Session implements SessionInterface {
  protected config: ConfigInterface;
  constructor(config: ConfigRecordInterface) {
    this.config = new Config(config);
  }

  public getItem(key: string): StorageValueType {
    throw new Error('Method not implemented');
  }

  public setItem(keyName: string, keyValue: StorageValueType): boolean {
    throw new Error('Method not implemented');
  }

  public removeItem(keyName: string): boolean {
    throw new Error('Method not implemented');
  }

  public clear(): boolean {
    throw new Error('Method not implemented');
  }

}
