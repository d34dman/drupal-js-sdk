import {AxiosClient} from './AxiosClient';
import {Core} from './Core';
import {ConfigInterface} from './interfaces';

export interface BasicAuthParams {
  username: string;
  password: string;
}

export interface DrupalConfig {
  auth?: BasicAuthParams;
  headers?: {[key: string]: any;};
  baseURL: string;
}

/**
 * Drupal.
 */
export class Drupal extends Core {

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
