import {FetchClient} from '@drupal-js-sdk/xhr';
import {Core} from './Core';

import {
  XhrBasicCredentials,
  StorageRecordInterface,
  XhrRequestHeaders
} from '@drupal-js-sdk/interfaces';
export interface DrupalConfig extends StorageRecordInterface {
  auth?: XhrBasicCredentials;
  headers?: XhrRequestHeaders;   
  baseURL: string;
  client?: import('@drupal-js-sdk/interfaces').XhrInterface;
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
    const client = options.client ?? new FetchClient(apiConfig);
    this.setClientService(client);
    return this;
  }
}
