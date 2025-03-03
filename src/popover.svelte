<script lang="ts">
  import TextContent from './text-content.svelte'

  export let label = ''
</script>

<div class="popover-wrap">
  <slot />
  <div class="popover">
    {#if label}
      <div class="tooltips">
        <TextContent>{label}</TextContent>
      </div>
    {:else}
      <slot name="pop" />
    {/if}
  </div>
</div>

<style>
  .popover-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .popover {
    position: absolute;
    bottom: 36em;
    left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4em;
    transform-origin: bottom left;
    background-color: var(--panel-color);
    opacity: 0;
    transform: scale(0) translateX(-50%);
    transition: all 0.3s ease-in-out;
  }
  .tooltips {
    height: 25em;
    display: flex;
    align-items: center;
  }
  .popover-wrap:hover .popover {
    opacity: 1;
    transform: scale(1) translateX(-50%);
  }
</style>
