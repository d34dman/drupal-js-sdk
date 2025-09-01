import { DrupalSettings } from "./dist/index.js";

const foo = new DrupalSettings(DrupalSettings.CACHE_MISS, "Test");

if (foo) {
  process.exit(0);
} else {
  process.exit(1);
}
