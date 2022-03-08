import {
  ClientInterface, 
  CoreInterface, 
  SessionInterface,
  StorageInterface, 
  StorageRecordInterface 
} from '@drupal-js-sdk/interfaces';

import { Config } from './Config';

interface ServiceBag {
  client?: ClientInterface;
  session?: SessionInterface;
}

export class Core implements CoreInterface {
  service: ServiceBag = {};
  public config: StorageInterface;

  constructor(config: StorageRecordInterface) {
    this.config = new Config(config);
  }

  public setConfigService(config: StorageInterface) {
    this.config = config;
    return this;
  }

  public getConfigService(): StorageInterface {
    return this.config;
  }

  public setClientService(client: ClientInterface): CoreInterface {
    this.service.client = client;
    return this;
  }

  public getClientService(): ClientInterface {
    if (this.service.client === undefined) {
      throw new Error(`ApiClientService undefined`);
    }
    return this.service.client;
  }

  public setSessionService(session: SessionInterface): CoreInterface {
    this.service.session = session;
    return this;
  }

  public getSessionService(): SessionInterface {
    if (this.service.session === undefined) {
      throw new Error(`SessionService undefined`);
    }
    return this.service.session;
  }
}
