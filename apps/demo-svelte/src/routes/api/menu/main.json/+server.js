import { drupalMenu } from "$lib/server/drupal";
import { json } from "@sveltejs/kit";
import { env as publicEnv } from "$env/dynamic/public";

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const baseURL = publicEnv.PUBLIC_DRUPAL_BASE_URL;
  if (!baseURL || String(baseURL).trim().length === 0) {
    // During build or if not configured, avoid network calls; return empty menu.
    return json([]);
  }
  const treeData = await drupalMenu.getMenu('main');
  const main_items = treeData.map((obj) => ({
    href: obj.href,
    label: obj.name,
    title: ''
  }));
  return json(main_items);
}


