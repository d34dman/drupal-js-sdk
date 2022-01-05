import {Core} from './Core';
import {Drupal} from './Drupal';
import {DrupalAuth} from './DrupalAuth';
import {DrupalError} from './DrupalError';
import {DrupalMenu} from './DrupalMenu';
import {DrupalRole} from './DrupalRole';
import {DrupalSettings} from './DrupalSettings';
import {AxiosClient} from './AxiosClient';


export { Core };
export { Drupal };
export { DrupalAuth };
export { DrupalError };
export { DrupalMenu };
export { DrupalRole };
export { DrupalSettings };
export { AxiosClient };

Object.assign(module.exports, Core);
Object.assign(module.exports, Drupal);
Object.assign(module.exports, DrupalAuth);
Object.assign(module.exports, DrupalError);
Object.assign(module.exports, DrupalMenu);
Object.assign(module.exports, DrupalRole);
Object.assign(module.exports, DrupalSettings);
Object.assign(module.exports, AxiosClient);