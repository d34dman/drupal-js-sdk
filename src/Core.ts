import {Config} from './Config';
import {ApiClientInterface, ConfigInterface, ConfigRecordInterface, CoreInterface, SessionInterface} from './interfaces';


export interface BasicAuthParams {
  username: string;
  password: string;
}
export interface ConfigConfigType {
  auth?: BasicAuthParams;
  headers?: {[key: string]: any;};
  baseURL?: string;
}

interface ServiceBag {
  client?: ApiClientInterface;
  session?: SessionInterface;
}

export class Core implements CoreInterface {
  service: ServiceBag = {};
  public config: ConfigInterface;

  constructor(config: ConfigRecordInterface) {
    this.config = new Config(config);
  }

  public setClient(apiClient: ApiClientInterface): CoreInterface {
    this.service.client = apiClient;
    return this;
  }

  public getClient(): ApiClientInterface {
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
