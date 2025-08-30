<script>
	import Header from "$lib/components/Header/index.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import "../app.css";
	export let data;
	const menu = Array.isArray(data?.menu) ? data.menu : [];
</script>
<Header {menu} />
<main>
	<slot />
</main>
<Footer />