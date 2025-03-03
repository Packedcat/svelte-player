<script lang="ts">
  import { getPlayerContext } from './player-context'
  const { paused } = getPlayerContext()
</script>

<div on:click={() => ($paused = !$paused)} role="button">
  <svg
    width="36em"
    height="36em"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {#if $paused}
      <path
        d="M12 24.2102C12 24.9925 12.8578 25.4719 13.5241 25.0618L18.5 21.9998V13.9998L13.5241 10.9377C12.8578 10.5276 12 11.007 12 11.7893V24.2102ZM18.5 21.9998L23.6161 18.8514C24.2506 18.4609 24.2506 17.5386 23.6161 17.1481L18.5 13.9998V21.9998Z"
        fill="white"
      />
    {:else}
      <path d="M13 13.514L13 24.514" stroke="white" stroke-width="2.6" stroke-linecap="round" />
      <path d="M23 13.514L23 24.514" stroke="white" stroke-width="2.6" stroke-linecap="round" />
    {/if}
  </svg>
</div>

<style>
  div {
    cursor: pointer;
  }
</style>
