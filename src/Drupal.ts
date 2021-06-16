import {CoreService} from './CoreService';
import FetchApiClient from './FetchApiClient';
import NodeFetchApiClient from './NodeFetchApiClient';

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
    if (this.core.get('IS_NODE')) {
      this.core.setApiClientService(new NodeFetchApiClient(apiConfig));
    } else {
      this.core.setApiClientService(new FetchApiClient(apiConfig));
    }
    return this;
  }
}
