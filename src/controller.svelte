<script lang="ts">
  import { getPlayerContext } from './player-context'
  const { paused, currentTime, volume, duration } = getPlayerContext()
  const SKIP_SECONDS = 5
  const VOLUME_STEP = 0.2

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
        $paused = !$paused
        break
      case 'ArrowLeft':
        $currentTime - SKIP_SECONDS < 0 ? ($currentTime = 0) : ($currentTime -= SKIP_SECONDS)
        break
      case 'ArrowRight':
        $currentTime + SKIP_SECONDS > $duration
          ? ($currentTime = $duration)
          : ($currentTime += SKIP_SECONDS)
        break
      case 'ArrowUp':
        $volume + VOLUME_STEP > 1 ? ($volume = 1) : ($volume += VOLUME_STEP)
        break
      case 'ArrowDown':
        $volume > VOLUME_STEP ? ($volume -= VOLUME_STEP) : ($volume = 0)
        break
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="aigc-controller">
  <div class="progress-bar">
    <slot name="progress-bar" />
  </div>
  <div class="control-bar">
    <slot name="control-bar" />
  </div>
</div>

<style>
  div.aigc-controller {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    display: flex;
    flex-wrap: wrap;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    background: linear-gradient(0, rgba(0, 0, 0, 0.8) 21.77%, rgba(0, 0, 0, 0) 100%);
  }
  div.progress-bar {
    width: 100%;
    padding: 0 14em;
  }
  div.control-bar {
    width: 100%;
    padding: 0 14em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
