<script>
	export const error = null;
</script>

<svelte:head>
	<title>Demo • Logged in</title>
</svelte:head>
<main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
	{#if error}
		<div
			class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<strong class="font-bold">Holy smokes!</strong>
			<span class="block sm:inline">{error}</span>
		</div>
	{/if}
	<div class="flex items-center w-full px-4 py-10 bg-cover card bg-base-200" style="background-image: url(&quot;https://picsum.photos/id/24/1000/300&quot;);">
	<div class="card glass lg:card-side text-neutral-content">
		<figure class="p-6">
		<img src="https://picsum.photos/id/119/300/200" class="rounded-lg shadow-lg" alt="a random background">
		</figure> 
		<div class="max-w-md card-body">
		<h2 class="card-title">Demo Logout</h2> 
		<p>The following logout button clears some session cookies on the server and thats it.</p> 
		<p>Am still working on getting DrupalAuth.logout work for serverside (maybe never will, lets see).</p>
		<div class="card-actions">
			<form method="POST" action="?/logout">
				<button class="btn glass rounded-full">Logout</button>
			</form>
		</div>
		</div>
	</div>
	</div>
</main>