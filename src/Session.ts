import {Config} from './Config';
import {ConfigInterface, ConfigRecordInterface, SessionInterface} from './interfaces';

export class Session implements SessionInterface {
  protected config: ConfigInterface;
  constructor(config: ConfigRecordInterface) {
    this.config = new Config(config);
  }
}
