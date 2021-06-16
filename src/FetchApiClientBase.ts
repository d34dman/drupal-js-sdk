import {DrupalError} from './DrupalError';
import {ApiClientInterface} from './interfaces/ApiClientInterface';

interface JsonErrorResponseType {
  code: number;
  error: string;
}

interface Config<TValue> {
  [id: string]: TValue;
}


export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';

export default abstract class FetchApiClientBase implements ApiClientInterface {
  private _config: Config<any> = {};
  private _client: any;

  public constructor(config: Config<any>) {
    this.setConfig(config);
  }

  public getConfig(): Config<any> {
    return this._config;
  }

  public setConfig(config: Config<any>): ApiClientInterface {
    this._config = config;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public setClient(client: any): ApiClientInterface {
    this._client = client;
    return this;
  }

  public getClient(): any {
    return this._client;
  }

  public addDefaultHeaders(headers: {[key: string]: any;}): FetchApiClientBase {
    if (this._config.headers === undefined) {
      this._config.headers = headers;
    } else {
      Object.assign(this._config.headers, headers);
    }
    return this;
  }

  request(
    method: Method,
    path: string,
    config?: {[key: string]: any;},
  ): Promise<any> {
    const reqCofnig: Config<any> = {
      method,
      credentials: 'include',
      ...config,
    };
    if (reqCofnig.data !== undefined) {
      reqCofnig.body = JSON.stringify(reqCofnig.data);
    }
    let url = `${this.getConfig().baseURL}${path}`;
    if (config !== undefined && config.params !== undefined) {
      // convert object to a query string
      const qs = Object.keys(config.params)
      .map((key) => `${key}=${config.params[key]}`)
      .join('&');
      url = `${url}?${qs}`;
    }
    return this._client(url, reqCofnig)
      .then((response: any) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new DrupalError(42, 'Answer');
        }
      })
      .then((res: any) => {
        try {
          return {data: JSON.parse(res)};
        } catch (err) {
          return {data: res};
        }
      });
  }

  getDrupalError(response: {[key: string]: any;} | string): DrupalError {
    // Transform the error into an instance of DrupalError by trying to parse
    // the error string as JSON
    let error;
    if (typeof response === 'string') {
      error = new DrupalError(
        DrupalError.CONNECTION_FAILED,
        `Fetch method failed: ${response}`,
      );
    } else if (response.responseText === undefined) {
      const message = response.message ? response.message : response;
      error = new DrupalError(
        DrupalError.CONNECTION_FAILED,
        `Fetch method failed: ${JSON.stringify(message)}`,
      );
    } else {
      try {
        const errorJSON: JsonErrorResponseType = JSON.parse(
          response.responseText,
        );
        error = new DrupalError(errorJSON.code, errorJSON.error);
      } catch (exception) {
        // If we fail to parse the error text, that's okay.
        error = new DrupalError(
          DrupalError.INVALID_JSON,
          `Received an error with invalid JSON from Drupal: ${response.responseText}`,
        );
      }
    }
    return error;
  }
}
