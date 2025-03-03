<script lang="ts">
  import Hls from 'hls.js'
  import { onDestroy, onMount, setContext } from 'svelte'

  import Play from './play.svelte'
  import Level from './level.svelte'
  import Volume from './volume.svelte'
  import TimeLabel from './time-label.svelte'
  import TimeRange from './time-range.svelte'
  import Fullscreen from './fullscreen.svelte'
  import PlaybackRate from './playback-rate.svelte'
  import Container from './container.svelte'
  import Controller from './controller.svelte'
  import Spinner from './spinner.svelte'
  import { EventBus } from './event-bus'
  import { createPlayerStore, playerContextKey, type EventMap } from './player-context'

  export let src: string
  export let vttSrc: string
  export let scale = 1
  export let noRounded = false

  const playerStore = createPlayerStore()
  const eventBus = new EventBus<EventMap>()
  const {
    vttUrl,
    vttCues,
    levels,
    currentLevel,
    muted,
    paused,
    volume,
    buffered,
    duration,
    currentTime,
    playbackRate,
    scale: storeScale,
  } = playerStore
  setContext(playerContextKey, { ...playerStore, eventBus })

  let ready = false
  let spinning = false
  let video: HTMLVideoElement | null = null

  const hls = new Hls()
  hls.startLevel = -1
  hls.currentLevel = -1
  hls.loadSource(src)
  hls.on(Hls.Events.ERROR, (_, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          // NOTE: try to recover network error
          console.error('fatal network error encountered, try to recover')
          hls.startLoad()
          break
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.error('fatal media error encountered, try to recover')
          hls.recoverMediaError()
          break
        default:
          // NOTE: cannot recover
          hls.destroy()
          break
      }
    }
  })
  hls.on(Hls.Events.MEDIA_ATTACHED, (_, data) => {
    const trackEl = document.createElement('track')
    trackEl.src = vttSrc
    trackEl.default = true
    trackEl.kind = 'metadata'
    trackEl.label = 'thumbnails'
    data.media.appendChild(trackEl)
    trackEl.onload = () => {
      $vttCues = Array.from(trackEl.track.cues || []) as VTTCue[]
      $vttUrl = trackEl.src
      ready = true
    }
  })

  currentLevel.subscribe((level) => (hls.nextLevel = level))
  hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
    $levels = data.levels
  })
  hls.on(Hls.Events.LEVEL_SWITCHED, (_, d) => {
    // TODO: prompt user this message
    console.info(`video successful change to ${hls.levels[d.level].height}p`)
  })

  onMount(() => {
    hls.attachMedia(video!)
  })
  onDestroy(() => {
    hls.detachMedia()
    hls.off(Hls.Events.MANIFEST_PARSED)
    hls.off(Hls.Events.LEVEL_SWITCHED)
    hls.off(Hls.Events.MEDIA_ATTACHED)
    hls.off(Hls.Events.ERROR)
    hls.destroy() // NOTE: clean up HLS player
  })
  $: storeScale.set(scale)
  $: paused.subscribe((v) => v && (spinning = false))
</script>

<Container {noRounded}>
  <video
    bind:this={video}
    bind:muted={$muted}
    bind:paused={$paused}
    bind:volume={$volume}
    bind:duration={$duration}
    bind:buffered={$buffered}
    bind:currentTime={$currentTime}
    bind:playbackRate={$playbackRate}
    on:click={() => ($paused = !$paused)}
    on:waiting={() => (spinning = true)}
    on:playing={() => (spinning = false)}
    controls={false}
    crossorigin="true"
  />
  {#if ready}
    <Controller>
      <TimeRange slot="progress-bar" />
      <svelte:fragment slot="control-bar">
        <div style="display: flex;">
          <Play />
          <Volume />
          <TimeLabel />
        </div>
        <div style="display: flex;">
          <Level />
          <PlaybackRate />
          <Fullscreen />
        </div>
      </svelte:fragment>
    </Controller>
  {/if}
  {#if spinning}
    <Spinner />
  {/if}
</Container>

<style>
  video {
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
</style>
