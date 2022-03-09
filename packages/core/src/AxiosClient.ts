import axios from 'axios';

import {XhrInterface, XhrInstance, XhrRequestConfig, XhrResponse, XhrMethod} from '@drupal-js-sdk/interfaces';

import {DrupalError} from '@drupal-js-sdk/error';
import {StorageRecordInterface} from '@drupal-js-sdk/interfaces';

interface JsonErrorResponseType {
  code: number;
  error: string;
}
export class AxiosClient implements XhrInterface {
  public client: XhrInstance;

  constructor(options: XhrRequestConfig = {}) {
    this.client = axios.create(options);
    this.client.defaults.withCredentials = true;
  }

  public setClient(client: XhrInstance): XhrInterface {
    this.client = client;
    return this;
  }

  public getClient(): XhrInstance {
    return this.client;
  }

  public addDefaultHeaders(headers: StorageRecordInterface): AxiosClient {
    Object.assign(this.client.defaults.headers, headers);
    return this;
  }

  call(
    method: XhrMethod,
    path: string,
    config?: StorageRecordInterface,
  ): Promise<XhrResponse> {
    const reqCofnig: XhrRequestConfig = {
      method,
      url: path,
      ...config,
    };
    return this.request(reqCofnig)
      .then((response) => {
        return response;
      }, (response) => {
        throw this.getDrupalError(response);
      });
  }


  request(reqConfig: XhrRequestConfig): Promise<XhrResponse> {
    return this.client.request(reqConfig);
  }

  getDrupalError(response: XhrResponse): DrupalError {
    // Transform the error into an instance of DrupalError by trying to parse
    // the error string as JSON
    let error;
    const data = response.data;
    
    if (
      typeof data === 'string' || 
      typeof data === 'undefined' || 
      typeof data === 'number' || 
      typeof data === 'boolean'
    ) {
      error = new DrupalError(
        DrupalError.CONNECTION_FAILED,
        `Axios method failed: ${data}`,
      );
    } else if (data.responseText === undefined) {
      error = new DrupalError(
        DrupalError.CONNECTION_FAILED,
        `Axios method failed: ${JSON.stringify(data)}`,
      );
    } else if (typeof data.responseText === 'string') {
      try {
        const errorJSON: JsonErrorResponseType = JSON.parse(
          data.responseText
        );
        error = new DrupalError(errorJSON.code, errorJSON.error);
      } catch (exception) {
        // If we fail to parse the error text, that's okay.
        error = new DrupalError(
          DrupalError.INVALID_JSON,
          `Received an error with invalid JSON from Drupal: ${data.responseText}`,
        );
      }
    }
    else {
      error = new DrupalError(
        DrupalError.INVALID_JSON,
        `Received an error with invalid JSON from Drupal: ${data.responseText}`,
      );
    }
    return error;
  }
}
