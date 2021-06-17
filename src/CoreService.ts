import type {ApiClientInterface} from './interfaces/ApiClientInterface';

interface Config<TValue> {
  [id: string]: TValue;
}

interface Service {
  ApiClientService?: ApiClientInterface;
}

export class CoreService {
  service: Service = {};
  config: Config<any> = {
    IS_NODE:
      typeof process !== 'undefined' &&
      Boolean(process.versions) &&
      Boolean(process.versions.node) &&
      !process.versions.electron,
    REQUEST_HEADERS: {},
    SERVER_URL: 'https://api.drupal.com',
  };

  public get(key: string): any {
    if (Object.prototype.hasOwnProperty.call(this.config, key)) {
      return this.config[key];
    }
    throw new Error(`Configuration key not found: ${key}`);
  }

  public set(
    key: string,
    value: boolean | number | string | {[key: string]: unknown;},
  ): CoreService {
    this.config[key] = value;
    return this;
  }

  public setApiClientService(apiClient: ApiClientInterface): CoreService {
    this.service.ApiClientService = apiClient;
    return this;
  }

  public getApiClientService(): ApiClientInterface {
    if (this.service.ApiClientService === undefined) {
      throw new Error(`ApiClientService undefined`);
    }
    return this.service.ApiClientService;
  }
}
