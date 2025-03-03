<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { getPlayerContext } from './player-context'
  import PreviewThumbnail from './preview-thumbnail.svelte'
  import { sliderable } from './actions'

  const { buffered, currentTime, duration } = getPlayerContext()
  let seeking = false
  let percent = $currentTime / $duration
  let previewPercent = 0
  // NOTE: update tray bar by currentTime change if not seeking
  currentTime.subscribe((ct) => !seeking && (percent = ct / $duration))

  function handleCueChange(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    let p = (e.clientX - left) / width
    if (p < 0) p = 0
    if (p > 1) p = 1
    previewPercent = p
  }

  // @see https://github.com/sveltejs/svelte/issues/7342
  $: svelteBuffer = buffered as unknown as Writable<{ start: number; end: number }[]>
</script>

<div class="time-range">
  <div
    class="slider"
    use:sliderable
    on:slidermove={(e) => {
      seeking = true
      percent = e.detail
      previewPercent = e.detail
    }}
    on:sliderend={() => {
      seeking = false
      $currentTime = $duration * percent
    }}
    on:pointermove={handleCueChange}
  >
    {#each $svelteBuffer as sb}
      <div
        class="buffered"
        style:left="{(sb.start / $duration) * 100}%"
        style:width="{((sb.end - sb.start) / $duration) * 100}%"
      />
    {/each}
    <div class="tray" style:width="{percent * 100}%" />
    <div class="knob" style:--progress="{percent * 100}%" class:seeking />
  </div>
  <PreviewThumbnail percent={previewPercent} {seeking} />
</div>

<style>
  .time-range {
    position: relative;
    display: flex;
    align-items: center;
    --range-height: 4em;
  }
  .slider {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: var(--range-height);
    background: var(--border-color);
    border-radius: var(--range-height);
  }
  .slider::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 300%;
    top: -100%;
  }
  .tray {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--primary-color);
    border-radius: var(--range-height);
  }
  .buffered {
    position: absolute;
    top: 0;
    height: 100%;
    background: var(--secondary-color);
    border-radius: var(--range-height);
  }
  .knob {
    position: absolute;
    top: -4em;
    width: 12em;
    height: 12em;
    border-radius: 6em;
    left: calc(var(--progress) - 6em);
    background: var(--primary-color);
    transform: scale(0);
    transition: transform 0.3s ease-in-out;
  }
  .time-range:hover .knob,
  .knob.seeking {
    transform: scale(1);
  }
</style>
