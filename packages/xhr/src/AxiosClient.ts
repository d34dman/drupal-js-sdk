import {XhrInterface, XhrRequestConfig, XhrResponse, XhrMethod} from '@drupal-js-sdk/interfaces';

import {StorageRecordInterface} from '@drupal-js-sdk/interfaces';
import { Client } from './Client';

// Minimal axios-like client interface to avoid leaking axios types across package boundaries
interface HttpClientLike {
  request<T = unknown, D = unknown>(config: XhrRequestConfig<D>): Promise<XhrResponse<T, D>>;
}

export class AxiosClient extends Client implements XhrInterface {

  public client: HttpClientLike;
  protected config: StorageRecordInterface;

  constructor(client: HttpClientLike) {
    super();
    this.client = client;
    this.config = {
      headers: {}
    };
  }

  public setClient(client: HttpClientLike): XhrInterface {
    this.client = client;
    return this;
  }

  public getClient(): HttpClientLike {
    return this.client;
  }

  public addDefaultHeaders(headers: StorageRecordInterface): XhrInterface {
    Object.assign(this.config.headers, headers);
    return this;
  }

  public call(
    method: XhrMethod,
    path: string,
    config?: XhrRequestConfig,
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
