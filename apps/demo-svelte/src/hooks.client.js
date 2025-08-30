

/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error, event }) {
	console.log({error, event});
	return {
	  message: 'Whoop!',
	  code: error?.code ?? 'UNKNOWN'
	};
  }