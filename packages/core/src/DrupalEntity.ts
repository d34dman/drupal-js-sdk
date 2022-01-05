import {Config} from './Config';
import {ConfigInterface, ConfigRecordInterface, CoreInterface, StorageValueType} from './interfaces';

export interface DrupalEntityConfig extends ConfigRecordInterface {
    entity: string;
    bundle: string;
    identifier: string;
}

export interface JsonApiConfig extends ConfigRecordInterface {
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

  public getJsonApiConfig(): StorageValueType {
    return this.config.getItem(DrupalEntity.JSON_API);
  }
}
