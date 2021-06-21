import {ResourceHandlerInterface} from './interfaces';

export interface EntityType {
    type: string;
    id: string;
    attributes: ConfigValue<any>;
}
