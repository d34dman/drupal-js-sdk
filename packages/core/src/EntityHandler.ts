import {Config} from './Config';
import {ConfigRecordInterface} from './interfaces';

interface EntityHandlerConfig extends ConfigRecordInterface{
    type: string;
    bundle: string;
    keys: {[key: string]: any;};
}

export class EntityHandler extends Config {

  constructor(config: EntityHandlerConfig) {
    super(config);
  }

  public create(data: ConfigRecordInterface): {[key: string]: any;} {
    return {};
  }

  public read(id: string): {[key: string]: any;} {
    return {};
  }

  public update(data: ConfigRecordInterface): {[key: string]: any;} {
    return {};

  }

  public delete(id: string): {[key: string]: any;} {
    return {};

  }

  public query(query: {[key: string]: any;}): {[key: string]: any;} {
    return {};
  }
}
