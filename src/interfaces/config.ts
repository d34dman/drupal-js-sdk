import {StorageInterface, StorageKeyType, StorageValueType} from './storage';

export type ConfigRecordKeyType = StorageKeyType;
export type ConfigRecordValueType = StorageValueType;
export interface ConfigRecordInterface {
    [id: ConfigRecordKeyType]: ConfigRecordValueType;
}

export interface ConfigInterface extends StorageInterface{
    getType(): string;
    getConfig(): ConfigRecordInterface;
    setConfig(config: ConfigRecordInterface): ConfigInterface ;
}
