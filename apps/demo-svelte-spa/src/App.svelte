<script lang="ts">
  import { onMount } from "svelte";
  import Login from "./lib/components/Login.svelte";
  import Menu from "./lib/components/Menu.svelte";
  import { authState, checkLogin, logout } from "./lib/authStore";

  onMount(() => {
    // Check login status on load
    checkLogin();
  });
</script>

{#if $authState.isLoggedIn}
  <Menu>
    <div class="mr-4">
      <button class="btn btn-outline btn-sm" on:click={logout}>Logout</button>
    </div>
  </Menu>
  <main class="container mx-auto p-6">
    <div class="prose">
      <h1>Authenticated</h1>
      <p>
        You are logged in. Explore the menu from Drupal and use this as a base for entity listing in the next steps.
      </p>
    </div>
  </main>
{:else}
  <Login />
{/if}
