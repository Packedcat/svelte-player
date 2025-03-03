<script lang="ts">
  import { getPlayerContext } from './player-context'
  import TextContent from './text-content.svelte'
  import { timeFormat } from './utils'
  const { currentTime, duration } = getPlayerContext()
</script>

<div class="time-label">
  <TextContent>
    {timeFormat($currentTime)} / {$duration ? timeFormat($duration) : '--:--'}
  </TextContent>
</div>

<style>
  .time-label {
    height: 36em;
    line-height: 36em;
    text-align: center;
  }
</style>
