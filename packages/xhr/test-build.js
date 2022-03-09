sdk = require('./dist')


const config = {
    baseURL: 'http://www.example.com',
};

const drupal = new sdk.Drupal(config);

const drupalMenu = new sdk.DrupalMenu(drupal);

if (drupal && drupalMenu) {
    process.exit(0);
}
else {
    process.exit(1);
}