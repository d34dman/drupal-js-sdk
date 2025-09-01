import { FetchClient } from "@drupal-js-sdk/xhr";
import { Core } from "./Core";
import { StorageInMemory, StorageInWeb } from "@drupal-js-sdk/storage";
import { SessionInterface } from "@drupal-js-sdk/interfaces";

import {
  XhrBasicCredentials,
  StorageRecordInterface,
  XhrRequestHeaders,
} from "@drupal-js-sdk/interfaces";
export interface DrupalConfig extends StorageRecordInterface {
  auth?: XhrBasicCredentials;
  headers?: XhrRequestHeaders;
  baseURL: string;
  client?: import("@drupal-js-sdk/interfaces").XhrInterface;
  /** Optional session store implementation; defaults to browser Storage if available, else in-memory. */
  session?: SessionInterface;
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
      ...(Boolean(options.auth) && { auth: options.auth }),
      ...(Boolean(options.headers) && { headers: options.headers }),
      ...{ baseURL: options.baseURL },
    };
    const client = options.client ?? new FetchClient(apiConfig);
    this.setClientService(client);
    // Initialize a default session storage if one is not explicitly provided.
    if (options.session) {
      this.setSessionService(options.session);
    } else {
      try {
        // Prefer Web Storage in browser environments.
        const web = new StorageInWeb(() => window.localStorage);
        this.setSessionService(web);
      } catch (e) {
        // Fallback to in-memory storage in non-browser or restricted environments.
        const memory = new StorageInMemory();
        this.setSessionService(memory);
      }
    }
    return this;
  }
}
