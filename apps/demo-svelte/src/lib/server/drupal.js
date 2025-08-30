import { Drupal, Core } from "@drupal-js-sdk/core";
import { DrupalAuth }  from "@drupal-js-sdk/auth";
import { DrupalMenu }  from "@drupal-js-sdk/menu";
import { StorageInMemory } from "@drupal-js-sdk/storage";
import { env as publicEnv } from "$env/dynamic/public";

const config = {
	baseURL: publicEnv.PUBLIC_DRUPAL_BASE_URL ?? ""
};
export const sdk = new Drupal(config);
// Awailable in Node and Browser environments.
const sessionStorage = new StorageInMemory();
sdk.setSessionService(sessionStorage);
// Lazily create auth to avoid network calls during SSR build
export const getAuth = () => new DrupalAuth(sdk);
export const drupalMenu = new DrupalMenu(sdk);
