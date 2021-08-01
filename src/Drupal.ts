import {AxiosClient} from './AxiosClient';
import {Core} from './Core';
import {
  ConfigInterface,
  ConfigRecordInterface,
  ConfigRecordValueType,
  ConfigRecordKeyType,
} from './interfaces';

export interface BasicAuthParams {
  username: string;
  password: string;
}

export interface DrupalConfig extends ConfigRecordInterface{
  auth?: BasicAuthParams;
  headers?: {[key: string]: any;};
  baseURL: string;
}

/**
 * Drupal.
 */
export class Drupal extends Core {


  constructor(config: DrupalConfig) {
    super(config);
    this.initialize(config);
  }

  initialize(options: DrupalConfig): Drupal {
    const apiConfig = {
      ...Boolean(options.auth) && {auth: options.auth},
      ...Boolean(options.headers) && {headers: options.headers},
      ...{baseURL: options.baseURL},
    };
    const client = new AxiosClient(apiConfig);
    this.setClient(client);
    return this;
  }
}
