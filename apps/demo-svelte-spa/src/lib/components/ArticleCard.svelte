<script lang="ts">
  /**
   * ArticleCard
   * Loads a node--article by id via JSON:API and renders a simple card.
   */
  import { onMount } from "svelte";
  import { entities } from "../sdk";
  import { DrupalJsonApiParams } from "drupal-jsonapi-params";

  export let id: string | null = null;

  type ArticleAttributes = {
    title?: string;
    created?: string;
    changed?: string;
    status?: boolean;
    body?: { value?: string } | string;
  };

  let loading: boolean = false;
  let error: string | null = null;
  let attrs: ArticleAttributes | null = null;

  async function load(): Promise<void> {
    if (!id || typeof id !== "string") {
      error = "Invalid article id";
      return;
    }
    loading = true;
    error = null;
    attrs = null;
    try {
      const params = new DrupalJsonApiParams();
      params.addInclude(["uid"]);
      const record: any = await entities.load<{ attributes: ArticleAttributes }>(
        { entity: "node", bundle: "article" },
        id,
        { jsonapi: { query: params.getQueryObject() } }
      );
      const loadedAttrs: ArticleAttributes | undefined = record?.attributes as ArticleAttributes | undefined;
      attrs = loadedAttrs ?? {};
    } catch (_e) {
      error = "Failed to load article";
    } finally {
      loading = false;
    }
  }

  $: if (id) {
    // Reactive reload on id change
    void load();
  }

  onMount(() => {
    if (id) {
      void load();
    }
  });
</script>

<div class="card bg-base-100 shadow w-full">
  <div class="card-body">
    {#if !id}
      <div class="opacity-70">Select an article to view details</div>
    {:else if loading}
      <div class="flex items-center gap-2"><span class="loading loading-spinner"></span> Loading</div>
    {:else if error}
      <div class="alert alert-error">{error}</div>
    {:else}
      <h3 class="card-title">{attrs?.title ?? "(untitled)"}</h3>
      <div class="text-xs opacity-70">
        <span class="mr-2">ID:</span><span class="font-mono">{id}</span>
      </div>
      <div class="text-sm">
        <span class="mr-2">Created:</span>{attrs?.created}
      </div>
      {#if typeof attrs?.body === "object" && attrs?.body?.value}
        <div class="mt-3 prose" innerHTML={attrs.body.value}></div>
      {/if}
    {/if}
  </div>
</div>

