const { DrupalError } = require('./src/DrupalError');

const error = new DrupalError(DrupalError.CACHE_MISS, 'Test');

if (error) {
    process.exit(0);
}
else {
    process.exit(1);
}
