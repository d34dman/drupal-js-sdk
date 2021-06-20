import type {ApiClientInterface} from './interfaces/ApiClientInterface';
import {CoreInterface} from './interfaces/CoreInterface';

interface Config<TValue> {
  [id: string]: TValue;
}

interface ServiceBag {
  ApiClientService?: ApiClientInterface;
}

export class Core implements CoreInterface {
  service: ServiceBag = {};
  config: Config<any> = {
    IS_NODE:
      typeof process !== 'undefined' &&
      Boolean(process.versions) &&
      Boolean(process.versions.node) &&
      !process.versions.electron,
    REQUEST_HEADERS: {},
    SERVER_URL: 'https://api.drupal.com',
    JSON_API_ENDPOINT: '/jsonapi',
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
  ): CoreInterface {
    this.config[key] = value;
    return this;
  }

  public setApiClientService(apiClient: ApiClientInterface): CoreInterface {
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
