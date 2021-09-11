import {Config} from './Config';
import {Drupal} from './Drupal';
import {ClientInterface, ConfigInterface, ConfigRecordInterface, CoreInterface} from './interfaces';
import {JsonApiResourceHandler} from './JsonApiResourceHandler';
import {ResourceHandler} from './ResourceHandler';

export interface DrupalEntityConfig extends ConfigRecordInterface {
    entity: string;
    bundle: string;
    identifier: string;
}

export interface JsonApiConfig {
    apiEndpoint: string;
    type: string;
}

export class DrupalEntity {
  static readonly JSON_API = 'JSON_API';

  public config: ConfigInterface;
  protected drupal: CoreInterface;

  constructor(config: DrupalEntityConfig, drupal: CoreInterface) {
    this.config = new Config(config);
    this.drupal = drupal;
  }

  public setJsonApiConfig(config: JsonApiConfig):
     DrupalEntity {
    this.config.setItem(DrupalEntity.JSON_API, config);
    return this;
  }

  public getJsonApiConfig(): JsonApiConfig {
    return this.config.getItem(DrupalEntity.JSON_API);
  }
}
