<script lang="ts">
  import { onMount } from "svelte";
  import { entities } from "../sdk";

  type ArticleAttrs = { title?: string; created?: string };

  let loading: boolean = true;
  let error: string | null = null;
  let items: Array<{ id: string; title: string; created?: string }> = [];

  export let onSelect: (id: string) => void = () => {};

  onMount(async () => {
    try {
      // Use SDK convenience list API
      const records = await entities
        .node<ArticleAttrs>("article")
        .select(["title", "created"])
        .sort("created", "DESC")
        .page({ limit: 10 })
        .list();
      items = records.map((rec) => ({
        id: rec.id,
        title: rec.attributes.title ?? "(untitled)",
        created: rec.attributes.created,
      }));
    } catch (_e) {
      error = "Failed to load nodes";
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-4">
  <h2 class="text-xl font-semibold mb-3">Latest Articles</h2>
  {#if loading}
    <div class="flex items-center gap-2"><span class="loading loading-spinner"></span> Loading</div>
  {:else if error}
    <div class="alert alert-error">{error}</div>
  {:else if items.length === 0}
    <div class="alert">No nodes found.</div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {#each items as n}
            <tr on:click={() => onSelect(n.id)} class="cursor-pointer hover">
              <td class="font-mono text-xs">{n.id}</td>
              <td>{n.title}</td>
              <td class="text-sm">{n.created}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
  <div class="mt-2 text-xs opacity-70">Source: /jsonapi/node/article</div>
  <slot />
  </div>

