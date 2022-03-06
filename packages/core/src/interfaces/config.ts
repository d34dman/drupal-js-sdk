import {StorageInterface, StorageRecordInterface, StorageValueType} from './storage';

export type ConfigRecordValueType = StorageValueType;
export interface ConfigRecordInterface extends StorageRecordInterface {}
export interface ConfigInterface extends StorageInterface {}
