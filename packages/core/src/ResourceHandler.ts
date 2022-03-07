import {Drupal} from './Drupal';
import {ClientInterface, ConfigInterface, ResourceHandlerInterface} from './interfaces';


export interface DrupalEntityConfig extends ConfigInterface {
    entity: string;
    bundle: string;
    identifier: string;
    drupal: Drupal;
}

export interface JsonApiConfigType {
    apiEndpoint: string;
    type: string;
}
export class ResourceHandler implements ResourceHandlerInterface {
  public config: DrupalEntityConfig;
  private readonly _client: ClientInterface;
  private _jsonApiConfig: JsonApiConfigType;

  constructor(config: DrupalEntityConfig) {
    this.config = config;
    this._client = config.drupal.getClientService();
    this._jsonApiConfig = {
      apiEndpoint: `/jsonapi/${config.entity}/${config.bundle}`,
      type: `${config.entity}-${config.bundle}`,
    };
  }

  public setConfig(config: JsonApiConfigType): ResourceHandlerInterface {
    this._jsonApiConfig = config;
    return this;
  }

  public getConfig(): JsonApiConfigType {
    return this._jsonApiConfig;
  }
}
