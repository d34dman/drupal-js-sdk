<script lang="ts">
  /**
   * Section header with optional icon and right-aligned actions.
   * Props: title
   * Slots: icon (left), actions (right)
   */
  export let title: string = "";
</script>

<div class="flex items-center justify-between mb-4">
  <h3 class="card-title flex items-center gap-2">
    <slot name="icon" />
    <span>{title}</span>
  </h3>
  <div class="flex items-center gap-2">
    <slot name="actions" />
  </div>
  </div>


