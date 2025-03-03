<script lang="ts">
  export let active = false
</script>

<div on:click class="popover-item" class:active>
  <slot />
</div>

<style>
  .popover-item {
    cursor: pointer;
    padding: 0 4em;
    height: 30em;
    line-height: 30em;
    text-align: center;
  }
  .popover-item:hover {
    opacity: 0.7;
  }
  .popover-item.active {
    color: var(--primary-color);
  }
</style>
