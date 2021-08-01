import {ResourceHandlerInterface,
    ConfigInterface,
    ConfigRecordInterface,
    ConfigRecordValueType,
    ConfigRecordKeyType,
  } from './interfaces';


export interface EntityType {
    type: string;
    id: string;
    attributes: ConfigRecordInterface;
}
