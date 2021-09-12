import {StorageInterface, StorageValueType} from './storage';

export type ConfigRecordValueType = StorageValueType;
export interface ConfigRecordInterface {
    [id: string]: ConfigRecordValueType;
}

export interface ConfigInterface extends StorageInterface{
    getType(): string;
    getConfig(): ConfigRecordInterface;
    setConfig(config: ConfigRecordInterface): ConfigInterface ;
}
