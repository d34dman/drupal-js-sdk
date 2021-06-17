import {AxiosApiClient} from './AxiosApiClient';
import {CoreService} from './CoreService';

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
export class Drupal {
  public core: CoreService;

  constructor() {
    this.core = new CoreService();
  }

  initialize(options: DrupalConfig): Drupal {
    const apiConfig = {
      ...Boolean(options.auth) && {auth: options.auth},
      ...Boolean(options.headers) && {headers: options.headers},
      ...{baseURL: options.baseURL},
    };
    const client = new AxiosApiClient(apiConfig);
    this.core.setApiClientService(client);
    return this;
  }
}