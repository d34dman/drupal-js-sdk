const { StorageInMemory } = require('./dist/StorageInMemory');

const storage = new StorageInMemory({});

if (storage) {
    process.exit(0);
}
else {
    process.exit(1);
}
