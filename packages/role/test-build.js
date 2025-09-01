import { DrupalRole } from "./dist/index.js";

const foo = new DrupalRole(DrupalRole.CACHE_MISS, "Test");

if (foo) {
  process.exit(0);
} else {
  process.exit(1);
}
