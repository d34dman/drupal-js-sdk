import {
  ConfigInterface,
  ConfigRecordInterface,
  ConfigRecordValueType,
  ConfigRecordKeyType,
} from './interfaces';

/**
 * Common getter setter for a config.
 */
export class Config implements ConfigInterface {

  protected _record: ConfigRecordInterface;

  constructor(config: ConfigRecordInterface) {
    this._record = config;
  }

  public getItem(key: ConfigRecordKeyType): ConfigRecordValueType {
    if (Object.prototype.hasOwnProperty.call(this._record, key)) {
      return this._record[key];
    }
    throw new Error(`Configuration key not found: ${key}`);
  }

  public setItem(keyName: ConfigRecordKeyType, keyValue: ConfigRecordValueType): boolean {
    this._record[keyName] = keyValue;
    return false;
  }

  public removeItem(keyName: ConfigRecordKeyType): boolean {
    delete this._record[keyName];
    return this._record[keyName] === undefined;
  }

  public clear(): boolean {
    this._record = {};
    return JSON.stringify(this._record) === JSON.stringify({});
  }

  public getConfig(): ConfigRecordInterface {
    return this._record;
  }

  public setConfig(config: ConfigRecordInterface): ConfigInterface {
    this._record = config;
    return this;
  }

  public getType(): string {
    return 'config';
  }

}
