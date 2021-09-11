import {Config} from './Config';
import {ConfigInterface, ConfigRecordInterface, SessionInterface} from './interfaces';

export class Session implements SessionInterface {
  protected config: ConfigInterface;
  constructor(config: ConfigRecordInterface) {
    this.config = new Config(config);
  }

  public getItem(key: string): string {
    // @TODO : indirectly use localstorage if avaiable.
    return '';
  }

  public setItem(keyName: string, keyValue: string): boolean{
    // @TODO : indirectly use localstorage if avaiable.
    return false;
  }

  public removeItem(keyName: string): boolean {
    return false;
  }

  public clear(): boolean {
    return false;
  }

}
