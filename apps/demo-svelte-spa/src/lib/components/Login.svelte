<script lang="ts">
  /**
   * Login screen for the demo app.
   * - Aligns with the app's modern design system (glass, gradients, rounded corners)
   * - Adds accessibility: associated labels, autocomplete hints, and busy state
   */
  import { authState, loginWithCredentials } from "../../lib/authStore";
  import logo from '../../assets/logo.svg'; 

  let username: string = import.meta.env.VITE_DEMO_USERNAME ?? "";
  let password: string = import.meta.env.VITE_DEMO_PASSWORD ?? "";
  let loading: boolean = false;

  async function submit(): Promise<void> {
    loading = true;
    await loginWithCredentials(username, password);
    loading = false;
  }
  const usernameId: string = "login-username";
  const passwordId: string = "login-password";
  const formTitleId: string = "login-title";
  const formDescId: string = "login-desc";
  const credentialsHint: string = "Use your Drupal credentials to sign in.";
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
  <!-- Glass card -->
  <div class="w-full max-w-md backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-2xl">
    <div class="px-6 py-6">
      <!-- Header -->
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <img src="{logo}" alt="Drupal JS SDK" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 id={formTitleId} class="text-lg font-bold text-slate-900 dark:text-white">Drupal Login</h2>
          <p id={formDescId} class="text-xs text-slate-600 dark:text-slate-400">{credentialsHint}</p>
        </div>
      </div>

      {#if $authState.error}
        <div class="mb-3 rounded-xl border border-red-200/60 dark:border-red-800/60 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-2 text-sm">
          {$authState.error}
        </div>
      {/if}

      <!-- Form -->
      <form aria-labelledby={formTitleId} aria-describedby={formDescId} on:submit|preventDefault={submit} class="space-y-3">
        <div class="form-control">
          <label class="label" for={usernameId}>
            <span class="label-text text-sm text-slate-700 dark:text-slate-300">Username</span>
          </label>
          <input
            id={usernameId}
            class="input input-bordered w-full rounded-xl"
            name="username"
            autocomplete="username"
            placeholder="e.g. admin"
            bind:value={username}
            required
          />
        </div>

        <div class="form-control">
          <label class="label" for={passwordId}>
            <span class="label-text text-sm text-slate-700 dark:text-slate-300">Password</span>
          </label>
          <input
            id={passwordId}
            class="input input-bordered w-full rounded-xl"
            type="password"
            name="current-password"
            autocomplete="current-password"
            placeholder="Your password"
            bind:value={password}
            required
          />
        </div>

        <button
          type="submit"
          class="w-full inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-60"
          disabled={loading}
          aria-busy={loading}
        >
          {#if loading}
            <span class="loading loading-spinner mr-2"></span>
          {/if}
          Login
        </button>
      </form>
    </div>
  </div>

  <!-- Hints -->
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

