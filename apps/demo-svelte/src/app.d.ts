// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
interface SessionData {
	drupal?: {
		current_user: {
			uid: string,
			roles: string[],
			name: string,
		},
		csrf_token: string,
		logout_token: string,
	}
}
declare namespace App {
	interface Locals {
		session: import('svelte-kit-cookie-session').Session<SessionData>;
	}

	interface Platform {}

	interface PrivateEnv {}

	interface PublicEnv {}
	interface PageData {
		session: SessionData;
		// every page must have a <title>
		title: string;
	}
}
