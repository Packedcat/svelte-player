<script lang="ts">
  import { screenfull } from './screenfull'
  import { getPlayerContext } from './player-context'

  export let noRounded: boolean

  let player: HTMLElement | null = null
  const { fullPage, eventBus, scale } = getPlayerContext()
  eventBus.subscribe('fullscreen_request', (isFullscreen) => {
    !isFullscreen && ($fullPage = false)
    player && screenfull.toggle(player)
  })
</script>

<figure
  bind:this={player}
  class="aigc-player"
  class:full-page={$fullPage}
  class:noRounded
  style:font-size="{$scale}px"
>
  <slot />
</figure>

<style>
  :global(.aigc-player, .aigc-player *, .aigc-player *:before, .aigc-player *:after) {
    box-sizing: border-box;
    user-select: none;
  }
  .aigc-player {
    font-family: -apple-system, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
      'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';
    text-rendering: optimizeLegibility;
    -ms-overflow-style: scrollbar;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    --primary-color: #b938d9;
    --secondary-color: #eb9aff;
    --border-color: #f3f3f8;
    --panel-color: rgba(47, 43, 67, 0.9);

    position: relative;
    width: 960em;
    height: 540em;
    padding: 0;
    margin: 0;
    color: white;
    background-color: black;
    border-radius: 16em;
    overflow: hidden;
  }
  .aigc-player.noRounded {
    border-radius: unset;
  }
  .full-page {
    position: fixed;
    z-index: 100000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  :global(.aigc-player:hover .aigc-controller) {
    opacity: 1;
  }
</style>
