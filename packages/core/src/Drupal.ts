import {AxiosClient} from './AxiosClient';
import {Core} from './Core';
import {AxiosRequestHeaders} from 'axios';
import {
  ConfigRecordInterface,
  BasicAuthParams
} from './interfaces';

export interface DrupalConfig extends ConfigRecordInterface{
  auth?: BasicAuthParams;
  headers?: AxiosRequestHeaders;   
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
