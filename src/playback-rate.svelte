<script lang="ts">
  import { getPlayerContext } from './player-context'
  import Popover from './popover.svelte'
  import PopoverItem from './popover-item.svelte'
  import TextContent from './text-content.svelte'

  const { playbackRate } = getPlayerContext()
  const playbackRateConfig = ['2.0', '1.75', '1.5', '1.25', '1.0', '0.75', '0.5']
</script>

<Popover>
  <TextContent>{$playbackRate === 1 ? '倍速' : $playbackRate + 'x'}</TextContent>
  <svelte:fragment slot="pop">
    {#each playbackRateConfig as step}
      <PopoverItem on:click={() => ($playbackRate = +step)} active={$playbackRate === +step}>
        <TextContent>{step}x</TextContent>
      </PopoverItem>
    {/each}
  </svelte:fragment>
</Popover>
