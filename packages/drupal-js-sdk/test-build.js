const Core = require('./dist');
const Drupal = Core.Drupal;
const config = {
    baseURL: 'http://www.example.com',
};
const sdk = new Drupal(config);
sdk.config.setItem('FOO', 'bar');