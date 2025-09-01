<script lang="ts">
  import { onMount } from "svelte";
  import { entities } from "../sdk";
  import CodeBlock from "../components/CodeBlock.svelte";
  import StatusCard from "../components/StatusCard.svelte";
  import CollapsibleCode from "../components/CollapsibleCode.svelte";
  import { Database, Search, Plus, Play, FileText, CheckCircle, XCircle } from "@lucide/svelte";
  import BestPractices from "../components/BestPractices.svelte";
  import Button from "../components/Button.svelte";
  import Pills from "../components/Pills.svelte";
  import Footer from "../components/Footer.svelte";

  type ArticleAttrs = { 
    title?: string; 
    created?: string; 
    body?: { value?: string };
    status?: boolean;
  };

  let articles: Array<{ id: string; title: string; created?: string; status?: boolean }> = [];
  let selectedArticle: any = null;
  let loading = false;
  let error: string | null = null;
  let queryOptions = {
    limit: 5,
    sort: "-created",
    include: ["uid"],
    fields: ["title", "created", "status"]
  };

  const loadArticles = async () => {
    loading = true;
    error = null;
    
    try {
      const records = await entities
        .node<ArticleAttrs>("article")
        .select(queryOptions.fields)
        .sort(queryOptions.sort.replace("-", ""), queryOptions.sort.startsWith("-") ? "DESC" : "ASC")
        .page({ limit: queryOptions.limit })
        .include(queryOptions.include)
        .list();
      
      articles = records.map(record => ({
        id: record.id,
        title: record.attributes?.title || 'Untitled',
        created: record.attributes?.created,
        status: record.attributes?.status
      }));
      
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load articles";
    } finally {
      loading = false;
    }
  };

  const loadArticleDetails = async (articleId: string) => {
    try {
      const record = await entities
        .node<ArticleAttrs>("article")
        .select(["title", "body", "created", "status"])
        .include(["uid"])
        .id(articleId)
        .get();
      
      selectedArticle = record;
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load article details";
    }
  };

  onMount(() => {
    loadArticles();
  });
</script>

<div class="space-y-6">
  <!-- Introduction -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title text-2xl">
        <Database class="w-6 h-6 mr-2" />
        Entity Management
      </h2>
      <p class="text-base-content/70">
        The Entity module provides powerful content management capabilities for Drupal nodes, users, and custom entities.
        It features fluent query builders, relationship loading, caching, and type-safe operations.
      </p>
    </div>
  </div>

  <!-- Query Options -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title"> Query Configuration</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div class="form-control">
          <label class="label" for="limit-select">
            <span class="label-text">Limit</span>
          </label>
          <select id="limit-select" class="select select-bordered w-full" bind:value={queryOptions.limit}>
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
            <option value={20}>20 items</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label" for="sort-select">
            <span class="label-text">Sort</span>
          </label>
          <select id="sort-select" class="select select-bordered w-full" bind:value={queryOptions.sort}>
            <option value="-created">Newest first</option>
            <option value="created">Oldest first</option>
            <option value="title">By title</option>
          </select>
        </div>
        
        <div>
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fields</div>
          <div class="text-sm bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            {queryOptions.fields.join(", ")}
          </div>
        </div>
        
        <div>
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Include</div>
          <div class="text-sm bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            {queryOptions.include.join(", ")}
          </div>
        </div>
      </div>

      <Button 
        variant="primary"
        loading={loading}
        disabled={loading}
        on:click={loadArticles}
      >
        <Search class="w-4 h-4 mr-2" />
        {loading ? 'Loading...' : 'Reload Articles'}
      </Button>
    </div>
  </div>

  <!-- Live Results -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Article List -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title">Articles</h3>
        
        {#if error}
          <StatusCard state="error" title="Failed to load articles" description={error} />
        {/if}
        
        {#if loading}
          <div class="space-y-2">
            {#each Array(3) as _}
              <div class="skeleton h-12 w-full"></div>
            {/each}
          </div>
        {:else if articles.length > 0}
          <div class="space-y-2">
            {#each articles as article}
              <div 
                class="card bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-all duration-200 rounded-xl"
                on:click={() => loadArticleDetails(article.id)}
                role="button"
                tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && loadArticleDetails(article.id)}
              >
                <div class="card-body p-4">
                  <h4 class="font-semibold">{article.title}</h4>
                  <div class="flex justify-between text-sm text-base-content/70">
                    <span>ID: {article.id}</span>
                    <Pills variant={article.status ? 'success' : 'danger'} size="sm">
                      {article.status ? 'Published' : 'Unpublished'}
                    </Pills>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <StatusCard state="info" title="No articles" description="No articles found" />
        {/if}
      </div>
    </div>

    <!-- Article Details -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title"> Article Details</h3>
        
        {#if selectedArticle}
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-lg">{selectedArticle.attributes?.title}</h4>
              <p class="text-sm text-base-content/70">ID: {selectedArticle.id}</p>
            </div>
            
            {#if selectedArticle.attributes?.body?.value}
              <div>
                <h5 class="font-medium mb-2">Content</h5>
                <div class="prose prose-sm max-w-none">
                  {@html selectedArticle.attributes.body.value}
                </div>
              </div>
            {/if}
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium">Status:</span>
                <Pills variant={selectedArticle.attributes?.status ? 'success' : 'danger'} size="sm">
                  {selectedArticle.attributes?.status ? 'Published' : 'Unpublished'}
                </Pills>
              </div>
              <div>
                <span class="font-medium">Created:</span>
                <span class="ml-2">
                  {selectedArticle.attributes?.created ? new Date(selectedArticle.attributes.created).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        {:else}
          <StatusCard state="info" title="Article details" description="Click an article to view details" />
        {/if}
      </div>
    </div>
  </div>

  <!-- Code Examples -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Basic Usage -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Basic Usage</h3>
        <CollapsibleCode 
          title="Simple Entity Query"
          code={`import { DrupalEntity } from '@drupal-js-sdk/entity';

const entities = new DrupalEntity(drupal);

// Get articles with basic query
const articles = await entities
  .node("article")
  .list();`}
        />
      </div>
    </div>

    <!-- Advanced Querying -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Advanced Querying</h3>
        <CollapsibleCode 
          title="Fluent Query Builder"
          code={`// Complex query with fluent interface
const articles = await entities
  .node("article")
  .select(["title", "created", "status"])
  .sort("created", "DESC")
  .page({ limit: 10, offset: 0 })
  .include(["uid", "field_image"])
  .filter("status", "1")
  .list();`}
        />
      </div>
    </div>

    <!-- Single Entity -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg">
          <FileText class="w-5 h-5 mr-2" />
          Single Entity
        </h3>
        <CollapsibleCode 
          title="Fetch Single Entity"
          code={`// Load specific article with relationships
const article = await entities
  .node("article")
  .select(["title", "body", "created"])
  .include(["uid", "field_tags"])
  .find("123e4567-e89b-12d3-a456-426614174000");

// Access article title
// article.attributes.title`}
        />
      </div>
    </div>

    <!-- Error Handling -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg">⚠ Error Handling</h3>
        <CollapsibleCode 
          title="Robust Error Handling"
          code={`try {
  const article = await entities
    .node("article")
    .find(articleId);
} catch (error) {
  if (error.message.includes('404')) {

  } else {

  }
}`}
        />
      </div>
    </div>

    <!-- Type Safety -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Type Safety</h3>
        <CollapsibleCode 
          title="TypeScript Integration"
          code={`// Define entity attributes interface
interface ArticleAttrs {
  title?: string;
  body?: { value?: string };
  created?: string;
  status?: boolean;
}

// Use typed entity queries
const articles = await entities
  .node<ArticleAttrs>("article")
  .list();

// TypeScript knows the attribute types
articles.data.forEach(article => {
  // Access article title: article.attributes?.title // string | undefined
});`}
        />
      </div>
    </div>

    <!-- Relationships -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Relationships</h3>
        <CollapsibleCode 
          title="Managing Relationships"
          code={`// Include related entities
const articles = await entities
  .node("article")
  .include(["uid", "field_image", "field_tags"])
  .list();

// Access included relationships
articles.data.forEach(article => {
  const author = article.relationships?.uid?.data;
  const image = article.relationships?.field_image?.data;
  const tags = article.relationships?.field_tags?.data;
});`}
        />
      </div>
    </div>
  </div>

  <BestPractices
    doItems={[
      "Use select() to limit fields and improve performance",
      "Define TypeScript interfaces for entity attributes",
      "Handle errors gracefully with try/catch",
      "Use pagination for large datasets",
      "Cache frequently accessed entities",
    ]}
    dontItems={[
      "Fetch all fields when you only need a few",
      "Load large datasets without pagination",
      "Ignore relationship loading opportunities",
      "Make unnecessary individual entity requests",
      "Skip error handling for production code",
    ]}
  />

  <Footer />
</div>