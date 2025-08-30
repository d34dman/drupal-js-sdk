<script context="module">
	// export const prerender = true;
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch }) {
		const res = await fetch('/api/menu/main.json');
		if (res.ok) {
			return {
				props: {
					menu: await res.json()
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Could not load main menu data`)
		};
	}
</script>
<script>
	import Header from '$lib/components/Header/index.svelte';
	import Footer from '$lib/components/Footer.svelte';
  	import '../app.css';
	export let menu = [];
</script>
<Header  {menu} />
<main>
	<slot />
</main>
<Footer />