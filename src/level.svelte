<script lang="ts">
  import { getPlayerContext } from './player-context'
  import Popover from './popover.svelte'
  import PopoverItem from './popover-item.svelte'
  import TextContent from './text-content.svelte'

  const { currentLevel, levels } = getPlayerContext()
</script>

<Popover>
  <TextContent>{$levels[$currentLevel] ? `${$levels[$currentLevel].height}p` : '自动'}</TextContent>
  <svelte:fragment slot="pop">
    <PopoverItem on:click={() => ($currentLevel = -1)} active={$currentLevel === -1}>
      <TextContent>自动</TextContent>
    </PopoverItem>
    {#each $levels as level, i}
      <PopoverItem on:click={() => ($currentLevel = i)} active={$currentLevel === i}>
        <TextContent>{level.height}p</TextContent>
      </PopoverItem>
    {/each}
  </svelte:fragment>
</Popover>
