import { Drupal, DrupalAuth } from 'drupal-js-sdk';

const drupal = new Drupal().initialize({
	baseURL: process.env.VUE_APP_BASE_URL || ''
});

export default new DrupalAuth(drupal);
