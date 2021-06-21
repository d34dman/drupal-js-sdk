import {Config, ConfigValue} from './Config';

/**
 * Probably not needed.
 */
export class CoreConfig extends Config {
  protected readonly _default: ConfigValue<any> = {
    IS_NODE:
          typeof process !== 'undefined' &&
          Boolean(process.versions) &&
          Boolean(process.versions.node) &&
          !process.versions.electron,
    REQUEST_HEADERS: {},
    SERVER_URL: 'https://api.drupal.com',
    JSON_API_ENDPOINT: '/jsonapi',
  };
}
