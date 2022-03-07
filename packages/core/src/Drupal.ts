import {AxiosClient} from './AxiosClient';
import {Core} from './Core';
import {AxiosRequestHeaders} from 'axios';
import {
  BasicAuthParams
} from './interfaces';
import { StorageRecordInterface } from '@drupal-js-sdk/storage';

export interface DrupalConfig extends StorageRecordInterface {
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
    this.setClientService(client);
    return this;
  }
}
