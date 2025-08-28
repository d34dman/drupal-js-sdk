import { StorageInterface } from './storage';
import {XhrInterface} from './xhr'
export interface CoreInterface {
    config : StorageInterface;
    getClientService(): XhrInterface;
    getConfigService(): StorageInterface;
}
