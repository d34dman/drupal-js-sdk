/**
 * Drupal SDK singletons and helpers.
 * - Initializes Drupal core client with base URL from env
 * - Configures session storage for browser
 * - Exposes Auth and Menu facades
 */
import { Drupal } from "@drupal-js-sdk/core";
import { DrupalAuth } from "@drupal-js-sdk/auth";
import { DrupalMenu } from "@drupal-js-sdk/menu";
import { StorageInWeb } from "@drupal-js-sdk/storage";
import { DrupalEntity } from "@drupal-js-sdk/entity";
import { JsonApiEntityAdapter } from "@drupal-js-sdk/jsonapi";

// Read base URL from Vite env
const baseURL = import.meta.env.VITE_DRUPAL_BASE_URL as string | undefined;

if (!baseURL || typeof baseURL !== "string") {
  // Throw early so devs see clear error rather than silent failures
  throw new Error(
    "VITE_DRUPAL_BASE_URL is not set. Create .env and set the Drupal base URL."
  );
}

// Initialize Drupal core client
export const drupal = new Drupal({ baseURL });

// Attach session storage (browser localStorage)
drupal.setSessionService(new StorageInWeb(() => window.localStorage));

// Feature facades
export const auth = new DrupalAuth(drupal);
export const menu = new DrupalMenu(drupal);

// Entities via JSON:API
export const entities = new DrupalEntity(drupal)
  .registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx))
  .setDefaultAdapter("jsonapi");

export type { Drupal };

