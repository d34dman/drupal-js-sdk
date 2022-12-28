const { DrupalMenu } = require('./dist/DrupalMenu');


const error = new DrupalMenu(DrupalMenu.CACHE_MISS, 'Test');

if (error) {
    process.exit(0);
}
else {
    process.exit(1);
}
