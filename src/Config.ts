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

  public get(key: ConfigRecordKeyType): any {
    if (Object.prototype.hasOwnProperty.call(this._record, key)) {
      return this._record[key];
    }
    throw new Error(`Configuration key not found: ${key}`);
  }

  public set(
        key: ConfigRecordKeyType,
        value: ConfigRecordValueType,
    ): ConfigInterface {
    this._record[key] = value;
    return this;
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
