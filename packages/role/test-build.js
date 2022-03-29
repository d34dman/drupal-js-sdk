const { DrupalRole } = require('./dist/DrupalRole');


const error = new DrupalRole(DrupalRole.CACHE_MISS, 'Test');

if (error) {
    process.exit(0);
}
else {
    process.exit(1);
}
