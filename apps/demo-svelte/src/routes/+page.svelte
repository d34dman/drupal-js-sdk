
<script>
	import { page } from '$app/stores';
	import Login from '$lib/components/Login.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Page from '$lib/components/Page.svelte';
	let error = null;
	let debug_data = '';
	$: session = $page.data.session;
	$: debug_data = JSON.stringify(session)
	
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
{#if error}
<Alert type="error" message={error} />
{/if}
{#if session.drupal}
	<Page />
{:else}
	<Login />
{/if}
</section>
