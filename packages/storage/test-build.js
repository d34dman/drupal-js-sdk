import { StorageInMemory } from "./dist/index.js";

const storage = new StorageInMemory({});

if (storage) {
  process.exit(0);
} else {
  process.exit(1);
}
