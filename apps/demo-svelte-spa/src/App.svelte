<script lang="ts">
  import Login from "./lib/components/Login.svelte";
  import Menu from "./lib/components/Menu.svelte";
  import NodeList from "./lib/components/NodeList.svelte";
  import ArticleCard from "./lib/components/ArticleCard.svelte";
  import { authState, logout } from "./lib/authStore";
  let selectedId: string | null = null;
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
    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <NodeList onSelect={(id) => (selectedId = id)} />
      </div>
      <div>
        <ArticleCard id={selectedId} />
      </div>
    </div>
  </main>
{:else}
  <Login />
{/if}
