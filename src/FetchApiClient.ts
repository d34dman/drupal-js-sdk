import 'whatwg-fetch';
import FetchApiClientBase from './FetchApiClientBase';

interface Config<TValue> {
  [id: string]: TValue;
}
export default class FetchApiClient extends FetchApiClientBase {
  constructor(config: Config<any> = {}) {
    super(config);
    this.setClient(window.fetch);
  }
}
