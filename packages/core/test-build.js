sdk = require('./dist')


const config = {
    baseURL: 'http://www.example.com',
};

const drupal = new sdk.Drupal(config);

const auth = new sdk.DrupalAuth(drupal);

const drupalMenu = new sdk.DrupalMenu(drupal);

if (drupal && auth && drupalMenu) {
    process.exit(0);
}
else {
    process.exit(1);
}