<script lang="ts">
  import { getPlayerContext } from './player-context'
  import TextContent from './text-content.svelte'
  import { timeFormat } from './utils'

  export let percent = 0
  export let seeking = false
  const BASE_WIDTH = 178
  const BASE_HEIGHT = 100
  // NOTE: 89/932 and (932-89)/932
  const PERCENT_LOWER_THRESHOLD = 0.09549356223
  const PERCENT_UPPER_THRESHOLD = 0.90450643776
  const { vttUrl, vttCues, duration, scale } = getPlayerContext()

  let src = ''
  let naturalHeight: number
  let naturalWidth: number
  let width = `${BASE_WIDTH}em`
  let height = `${BASE_HEIGHT}em`
  let offsetX = ''
  let offsetY = ''
  let time = 0

  function previewChange(p: number) {
    time = p * $duration
    const cue = $vttCues.find((c) => c.startTime >= time)
    if (!cue) return
    const base = !/'^(?:[a-z]+:)?\/\//i.test(cue.text) ? $vttUrl : undefined
    const url = new URL(cue.text, base)
    const previewCoordsStr = new URLSearchParams(url.hash).get('#xywh')
    !src && (src = url.href)
    const [x, y, iwc, ihc] = previewCoordsStr?.split(',') ?? []
    const wAspect = (BASE_WIDTH * $scale) / +iwc
    const hAspect = (BASE_HEIGHT * $scale) / +ihc
    offsetX = `-${+x * wAspect}px`
    offsetY = `-${+y * hAspect}px`
    width = `${naturalWidth * wAspect}px`
    height = `${naturalHeight * hAspect}px`
  }

  $: strictPercent =
    percent < PERCENT_LOWER_THRESHOLD
      ? PERCENT_LOWER_THRESHOLD
      : percent > PERCENT_UPPER_THRESHOLD
      ? PERCENT_UPPER_THRESHOLD
      : percent
  $: previewChange(percent)
</script>

<div class="preview-thumbnail" class:seeking style:left="{strictPercent * 100}%">
  <img
    alt="preview-thumbnail"
    {src}
    bind:naturalHeight
    bind:naturalWidth
    style:width
    style:height
    style:--x={offsetX}
    style:--y={offsetY}
  />
  <div class="preview-time">
    <TextContent>{timeFormat(time)}</TextContent>
  </div>
</div>

<style>
  .preview-thumbnail {
    pointer-events: none;
    position: absolute;
    width: 178em;
    height: 100em;
    overflow: hidden;
    bottom: 16em;
    opacity: 0;
    transform: translateX(-50%);
    border-radius: 12em;
    transition: opacity 0.3s ease-in-out;
  }

  .preview-thumbnail img {
    transform: translate(var(--x), var(--y));
  }
  :global(.time-range:hover) .preview-thumbnail,
  .preview-thumbnail.seeking {
    opacity: 1;
  }
  .preview-time {
    position: absolute;
    bottom: 8em;
    width: 48em;
    left: 50%;
    transform: translateX(-50%);
    height: 26em;
    border-radius: 4em;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    background: var(--panel-color);
  }
</style>
