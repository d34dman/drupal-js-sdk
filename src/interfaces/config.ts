import {StorageInterface} from './storage';

export type ConfigRecordKeyType = string;
export type ConfigRecordValueType = boolean | number | string | {[key: string]: any;} | undefined;
export interface ConfigRecordInterface {
    [id: string]: ConfigRecordValueType;
}

export interface ConfigInterface extends StorageInterface{
    getType(): string;
    getConfig(): ConfigRecordInterface;
    setConfig(config: ConfigRecordInterface): ConfigInterface ;
}
