<script lang="ts">
  import Button from "./Button.svelte";
  import { Save, Trash2, Eye, Download, Settings, Check } from "@lucide/svelte";
</script>

<!-- Button Examples for Documentation -->
<div class="space-y-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl">
  <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Button Component Examples</h2>
  
  <!-- Variants -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Variants</h3>
    <div class="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  </div>

  <!-- Sizes -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Sizes</h3>
    <div class="flex flex-wrap items-center gap-3">
      <Button variant="primary" size="xs">Extra Small</Button>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  </div>

  <!-- With Icons -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">With Icons</h3>
    <div class="flex flex-wrap gap-3">
      <Button variant="primary">
        <Save class="w-4 h-4 mr-2" />
        Save Changes
      </Button>
      <Button variant="danger">
        <Trash2 class="w-4 h-4 mr-2" />
        Delete
      </Button>
      <Button variant="secondary">
        <Eye class="w-4 h-4 mr-2" />
        Preview
      </Button>
      <Button variant="success">
        <Download class="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  </div>

  <!-- States -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">States</h3>
    <div class="flex flex-wrap gap-3">
      <Button variant="primary">Normal</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" loading>Loading</Button>
      <Button variant="primary" fullWidth>Full Width</Button>
    </div>
  </div>
</div>
