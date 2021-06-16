import FetchApiClientBase from './FetchApiClientBase';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodeFetch = require('node-fetch');

interface Config<TValue> {
  [id: string]: TValue;
}
export default class NodeFetchApiClient extends FetchApiClientBase {

  constructor(config: Config<any> = {}) {
    super(config);
    this.setClient(NodeFetch);
  }

}
