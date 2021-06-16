import {DrupalError} from '../DrupalError';

interface Config<TValue> {
  [id: string]: TValue;
}

export interface ApiClientInterface {
  setClient(client: any): ApiClientInterface;
  getClient(): any;
  setConfig(config: Config<any>): ApiClientInterface;
  getConfig(): Config<any>;
  request(
    method: string,
    path: string,
    config?: {[key: string]: any;}
  ): Promise<any>;
  getDrupalError(response: any): DrupalError;
  addDefaultHeaders(headers: {[key: string]: any;}): ApiClientInterface;
}
