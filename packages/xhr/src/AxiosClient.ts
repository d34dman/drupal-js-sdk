import {XhrInterface, XhrRequestConfig, XhrResponse, XhrMethod} from '@drupal-js-sdk/interfaces';

import {StorageRecordInterface} from '@drupal-js-sdk/interfaces';
import { Client } from './Client';
import {AxiosInstance} from 'axios';

export class AxiosClient extends Client implements XhrInterface {

  public client: AxiosInstance;
  protected config: StorageRecordInterface;

  constructor(client: AxiosInstance) {
    super();
    this.client = client;
    this.config = {
      headers: {}
    };
  }

  public setClient(client: AxiosInstance): XhrInterface {
    this.client = client;
    return this;
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public addDefaultHeaders(headers: StorageRecordInterface): XhrInterface {
    Object.assign(this.config.headers, headers);
    return this;
  }

  public call(
    method: XhrMethod,
    path: string,
    config?: StorageRecordInterface,
  ): Promise<XhrResponse> {
    const reqCofnig: XhrRequestConfig = {
      method,
      url: path,
      ...this.config,
      ...config,
    };
    return this.request(reqCofnig)
      .then((response) => {
        return response;
      }, (response) => {
        throw this.getDrupalError(response);
      });
  }


  protected async request(reqConfig: XhrRequestConfig): Promise<XhrResponse> {
    return this.client.request(reqConfig);
  }

}
