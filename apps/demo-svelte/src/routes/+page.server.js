import { getAuth } from '$lib/server/drupal';
// @errors: 2339 2304
import { fail } from '@sveltejs/kit';

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
          loginError = err.response.data.message;
        }
      )
      .catch((err) => {
        loginError = err.response.data.message;
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