<script lang="ts">
  import { onMount } from "svelte";
  import { menu } from "../../lib/sdk";

  interface MenuNode {
    id: string;
    name: string;
    href: string;
    items?: MenuNode[];
  }

  let items: MenuNode[] = [];
  let error: string | null = null;
  let loading: boolean = true;

  onMount(async () => {
    try {
      // Fetch "main" menu; adjust if your site uses a different machine name
      items = await menu.getMenu("main");
    } catch (_e) {
      error = "Failed to load menu";
    } finally {
      loading = false;
    }
  });
</script>

<div class="navbar bg-base-100 shadow">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl" href="/">Svelte + Drupal</a>
  </div>
  <div class="flex-none">
    {#if loading}
      <span class="loading loading-spinner"></span>
    {:else if error}
      <div class="tooltip tooltip-left" data-tip={error}>
        <span class="badge badge-error">Menu</span>
      </div>
    {:else}
      <ul class="menu menu-horizontal px-1">
        {#each items as node}
          <li>
            {#if node.items && node.items.length}
              <details>
                <summary>{node.name}</summary>
                <ul class="bg-base-100 rounded-t-none p-2">
                  {#each node.items as child}
                    <li><a href={child.href}>{child.name}</a></li>
                  {/each}
                </ul>
              </details>
            {:else}
              <a href={node.href}>{node.name}</a>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <slot />
</div>

