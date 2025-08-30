import { handleSession } from 'svelte-kit-cookie-session';

// You can do it like this, without passing a own handle function
export const handle = handleSession(
	{
		// Optional initial state of the session, default is an empty object {}
		// init: (event) => ({
		// 	foo: Date.now(),
		// 	blah: 'bah'
		// }),
		secret: process.env.SESSION_SECRET ?? 'SOME_COMPLEX_SECRET_AT_LEAST_32_CHARS',
		rolling: 60,
		key: process.env.SESSION_KEY ?? 'kit.session'
	}
);

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
	console.log({error, event});
	return {
	  message: 'Whoops!',
	  code: error?.code ?? 'UNKNOWN'
	};
  }