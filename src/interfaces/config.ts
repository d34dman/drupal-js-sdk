import {StorageInterface} from './storage';

export type ConfigRecordKeyType = string;
export type ConfigRecordValueType = boolean | number | string | {[key: string]: any;} | undefined;
export interface ConfigRecordInterface {
    [id: string]: ConfigRecordValueType;
}

export interface ConfigInterface extends StorageInterface{
    getType(): string;
    get(key: string): any ;
    set(
          key: string,
          value: ConfigRecordValueType,
      ): ConfigInterface;
    getConfig(): ConfigRecordInterface;
    setConfig(config: ConfigRecordInterface): ConfigInterface ;
}
