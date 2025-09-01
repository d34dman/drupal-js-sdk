<script lang="ts">
  import Pills from "./Pills.svelte";
</script>

<div class="space-y-8 p-6">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Pills Component Examples</h2>
  
  <!-- Variants -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Variants</h3>
    <div class="flex flex-wrap gap-3">
      <Pills variant="primary">Primary</Pills>
      <Pills variant="secondary">Secondary</Pills>
      <Pills variant="success">Success</Pills>
      <Pills variant="danger">Danger</Pills>
      <Pills variant="warning">Warning</Pills>
      <Pills variant="info">Info</Pills>
      <Pills variant="neutral">Neutral</Pills>
    </div>
  </div>

  <!-- Sizes -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Sizes</h3>
    <div class="flex flex-wrap items-center gap-3">
      <Pills variant="primary" size="xs">Extra Small</Pills>
      <Pills variant="primary" size="sm">Small</Pills>
      <Pills variant="primary" size="md">Medium</Pills>
      <Pills variant="primary" size="lg">Large</Pills>
    </div>
  </div>

  <!-- Outlined -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Outlined</h3>
    <div class="flex flex-wrap gap-3">
      <Pills variant="primary" outline>Primary</Pills>
      <Pills variant="success" outline>Success</Pills>
      <Pills variant="danger" outline>Danger</Pills>
      <Pills variant="warning" outline>Warning</Pills>
    </div>
  </div>

  <!-- Status Pills -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Status Examples</h3>
    <div class="flex flex-wrap gap-3">
      <Pills variant="success">Published</Pills>
      <Pills variant="danger">Unpublished</Pills>
      <Pills variant="warning">Draft</Pills>
      <Pills variant="info">Pending</Pills>
    </div>
  </div>

  <!-- HTTP Methods -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">HTTP Methods</h3>
    <div class="flex flex-wrap gap-3">
      <Pills variant="success" outline size="sm">GET</Pills>
      <Pills variant="primary" outline size="sm">POST</Pills>
      <Pills variant="warning" outline size="sm">PUT</Pills>
      <Pills variant="danger" outline size="sm">DELETE</Pills>
    </div>
  </div>

  <!-- Type Indicators -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Data Types</h3>
    <div class="flex flex-wrap gap-3">
      <Pills variant="primary" size="sm">string</Pills>
      <Pills variant="success" size="sm">number</Pills>
      <Pills variant="warning" size="sm">boolean</Pills>
      <Pills variant="info" size="sm">object</Pills>
    </div>
  </div>

  <!-- Removable Pills -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Removable</h3>
    <div class="flex flex-wrap gap-3">
      <Pills variant="primary" removable>Tag 1</Pills>
      <Pills variant="secondary" removable>Tag 2</Pills>
      <Pills variant="success" removable>Tag 3</Pills>
    </div>
  </div>

  <!-- Disabled -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Disabled</h3>
    <div class="flex flex-wrap gap-3">
      <Pills variant="primary" disabled>Disabled</Pills>
      <Pills variant="success" disabled removable>Disabled Removable</Pills>
    </div>
  </div>
</div>
