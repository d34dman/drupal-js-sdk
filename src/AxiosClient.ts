import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

import {DrupalError} from './DrupalError';
import {ClientInterface} from './interfaces';

interface JsonErrorResponseType {
  code: number;
  error: string;
}
export class AxiosClient implements ClientInterface {
  public client: AxiosInstance;

  constructor(options: AxiosRequestConfig = {}) {
    this.client = axios.create(options);
    this.client.defaults.withCredentials = true;
  }

  public setClient(client: AxiosInstance): ClientInterface {
    this.client = client;
    return this;
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public addDefaultHeaders(headers: {[key: string]: any;}): AxiosClient {
    Object.assign(this.client.defaults.headers, headers);
    return this;
  }

  call(
    method: Method,
    path: string,
    config?: {[key: string]: any;},
  ): Promise<any> {
    const reqCofnig: AxiosRequestConfig = {
      method,
      url: path,
      ...config,
    };
    return this.request(reqCofnig)
      .then((response) => {
        return response;
      }, (response) => {
        return this.getDrupalError(response);
      });
  }


  request(reqConfig: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.request(reqConfig);
  }

  getDrupalError(response: {[key: string]: any;} | string): DrupalError {
    // Transform the error into an instance of DrupalError by trying to parse
    // the error string as JSON
    let error;
    if (typeof response === 'string') {
      error = new DrupalError(
        DrupalError.CONNECTION_FAILED,
        `Axios method failed: ${response}`,
      );
    } else if (response.responseText === undefined) {
      const message = response.message ? response.message : response;
      error = new DrupalError(
        DrupalError.CONNECTION_FAILED,
        `Axios method failed: ${JSON.stringify(message)}`,
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
