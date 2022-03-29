const { DrupalSettings } = require('./dist/DrupalSettings');


const error = new DrupalSettings(DrupalSettings.CACHE_MISS, 'Test');

if (error) {
    process.exit(0);
}
else {
    process.exit(1);
}
