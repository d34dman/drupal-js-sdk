import { getAuth } from "$lib/server/drupal";
import { fail } from "@sveltejs/kit";
import { env as publicEnv } from "$env/dynamic/public";

/** @type {import('@sveltejs/kit').PageData} */
export async function load({ parent }) {
  return await parent();
}


/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({ request, locals }) => {
      const data = await request.formData();
      const username = data.get('username');
      const password = data.get('password');
      let loginError = false;
      const baseURL = publicEnv.PUBLIC_DRUPAL_BASE_URL;
      if (!baseURL || String(baseURL).trim().length === 0) {
        return fail(500, { error: "Backend URL missing. Set PUBLIC_DRUPAL_BASE_URL." });
      }
      if (!username || typeof username !== 'string' ) {
        return fail(400, { username, missing: true });
      }
      if (!password || typeof password !== 'string' ) {
        return fail(400, { password, missing: true });
      }
      const drupalResponse = await getAuth()
      .login(username, password)
      .then(
        (response) => {
          return response.data;
        },
        (err) => {
          loginError = (err && typeof err === 'object' && 'message' in err) ? err.message : 'Login failed';
        }
      )
      .catch((err) => {
        loginError = (err && typeof err === 'object' && 'message' in err) ? err.message : 'Login failed';
      });

      if (loginError) {
        return { success: false };
      }
      await locals.session.update(({drupal}) => ({drupal: drupalResponse}));
      return { success: true };
    },
    register: async (event) => {
      // TODO register the user
    },
    logout: async ({locals}) => {
      locals.session.destroy();
    }
  };