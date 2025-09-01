<script lang="ts">
  import { CheckCircle, XCircle } from "@lucide/svelte";
  export let doItems: string[] = [];
  export let dontItems: string[] = [];
  export let title: string = "Best Practices";
</script>

<div class="card bg-base-100 shadow-md rounded-2xl">
  <div class="card-body">
    <h3 class="card-title text-lg"> {title} </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 class="font-semibold mb-3 flex items-center gap-2 text-success">
          <CheckCircle class="w-5 h-5 text-success" />
          <span>Do</span>
        </h4>
        <ul class="space-y-2 text-sm">
          {#each doItems as item}
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              {item}
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-3 flex items-center gap-2 text-error">
          <XCircle class="w-5 h-5 text-error" />
          <span>Don't</span>
        </h4>
        <ul class="space-y-2 text-sm">
          {#each dontItems as item}
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              {item}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
  </div>


