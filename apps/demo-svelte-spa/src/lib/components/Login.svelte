<script lang="ts">
  import { authState, loginWithCredentials } from "../../lib/authStore";
  import { get } from "svelte/store";

  let username: string = import.meta.env.VITE_DEMO_USERNAME ?? "";
  let password: string = import.meta.env.VITE_DEMO_PASSWORD ?? "";
  let loading: boolean = false;

  async function submit(): Promise<void> {
    loading = true;
    await loginWithCredentials(username, password);
    loading = false;
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
  <div class="card w-full max-w-md bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Drupal Login</h2>
      <p>Use your Drupal credentials to sign in.</p>
      {#if $authState.error}
        <div class="alert alert-error">
          <span>{$authState.error}</span>
        </div>
      {/if}
      <form on:submit|preventDefault={submit} class="form-control gap-3">
        <input class="input input-bordered" placeholder="Username" bind:value={username} />
        <input class="input input-bordered" type="password" placeholder="Password" bind:value={password} />
        <button class="btn btn-primary" disabled={loading}>
          {#if loading}
            <span class="loading loading-spinner"></span>
          {/if}
          Login
        </button>
      </form>
    </div>
  </div>
  <div class="fixed bottom-2 right-2 opacity-70 text-xs">
    <span class="kbd kbd-xs">admin</span>
    <span class="mx-1">/</span>
    <span class="kbd kbd-xs">admin</span>
  </div>
  <div class="fixed bottom-2 left-2 opacity-70 text-xs">
    <span>Backend:</span>
    <span class="ml-1 font-mono">{import.meta.env.VITE_DRUPAL_BASE_URL}</span>
  </div>
</div>

