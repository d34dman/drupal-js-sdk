import { StorageInterface } from './storage';
import { XhrInterface } from './xhr';
import { SessionInterface } from './session';
export interface CoreInterface {
    config : StorageInterface;
    getClientService(): XhrInterface;
    getConfigService(): StorageInterface;
    getSessionService(): SessionInterface;
}
