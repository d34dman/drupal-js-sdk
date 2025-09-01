import { Drupal } from "./dist/index.js";

const config = {
  baseURL: "http://www.example.com",
};

const drupal = new Drupal(config);

if (drupal) {
  process.exit(0);
} else {
  process.exit(1);
}
