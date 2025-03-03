<script lang="ts">
  import { onDestroy } from 'svelte'
  import Popover from './popover.svelte'
  import { screenfull } from './screenfull'
  import { getPlayerContext } from './player-context'

  let isFullscreen = screenfull.isFullscreen
  const { fullPage, eventBus } = getPlayerContext()

  function handleFullPage() {
    $fullPage = !$fullPage
  }
  function handleFullscreenChange() {
    isFullscreen = screenfull.isFullscreen
  }
  screenfull.on(handleFullscreenChange)
  onDestroy(() => {
    screenfull.off(handleFullscreenChange)
  })
</script>

{#if !isFullscreen}
  <Popover label={$fullPage ? '退出网页全屏' : '网页全屏'}>
    <div on:click={handleFullPage}>
      <svg
        width="36em"
        height="36em"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {#if $fullPage}
          <path
            d="M29.5 25V10.98C29.5 9.88 28.6 9 27.5 9H9.5C8.4 9 7.5 9.88 7.5 10.98V25C7.5 26.1 8.4 27 9.5 27H27.5C28.6 27 29.5 26.1 29.5 25ZM27.5 25.02H9.5V10.97H27.5V25.02Z"
            fill="white"
          />
          <path
            d="M20.9356 19.5546V22.3261C20.9356 23.1274 21.9024 23.5292 22.4718 22.962L25.2647 20.169C25.8298 19.604 25.4302 18.6351 24.6288 18.6351H21.8552C21.3481 18.6351 20.9356 19.0476 20.9356 19.5546Z"
            fill="white"
          />
          <path
            d="M16.0938 13.9008V16.6745C16.0938 17.1815 15.6813 17.594 15.1742 17.594H12.4006C11.5992 17.594 11.1996 16.625 11.7646 16.06L14.5576 13.267C15.1248 12.6977 16.0938 13.0995 16.0938 13.9008Z"
            fill="white"
          />
        {:else}
          <path
            d="M29 25V10.98C29 9.88 28.1 9 27 9H9C7.9 9 7 9.88 7 10.98V25C7 26.1 7.9 27 9 27H27C28.1 27 29 26.1 29 25ZM27 25.02H9V10.97H27V25.02Z"
            fill="white"
          />
          <path
            d="M11 16.6932V13.9195C11 13.4125 11.4125 13 11.9195 13H14.6932C15.4945 13 15.8941 13.9689 15.3291 14.534L12.5361 17.327C11.9689 17.8963 11 17.4945 11 16.6932ZM25.0301 19.5365V22.308C25.0301 22.815 24.6176 23.2275 24.1105 23.2275H21.3369C20.5355 23.2275 20.1359 22.2586 20.701 21.6936L23.4939 18.9006C24.0633 18.3334 25.0301 18.7352 25.0301 19.5365Z"
            fill="white"
          />
        {/if}
      </svg>
    </div>
  </Popover>
{/if}
<Popover label={isFullscreen ? '退出全屏' : '全屏'}>
  <div on:click={() => eventBus.publish('fullscreen_request', isFullscreen)}>
    <svg
      width="36em"
      height="36em"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 15.3998C10 15.7311 10.2686 15.9998 10.6 15.9998H11.4C11.7314 15.9998 12 15.7311 12 15.3998V12.5998C12 12.2684 12.2686 11.9998 12.6 11.9998H15.4C15.7314 11.9998 16 11.7311 16 11.3998V10.5998C16 10.2684 15.7314 9.99976 15.4 9.99976H10.6C10.2686 9.99976 10 10.2684 10 10.5998V15.3998Z"
        fill="white"
      />
      <path
        d="M20.6 9.99976C20.2686 9.99976 20 10.2684 20 10.5998V11.3998C20 11.7311 20.2686 11.9998 20.6 11.9998H23.4C23.7314 11.9998 24 12.2684 24 12.5998V15.3998C24 15.7311 24.2686 15.9998 24.6 15.9998H25.4C25.7314 15.9998 26 15.7311 26 15.3998V10.5998C26 10.2684 25.7314 9.99976 25.4 9.99976H20.6Z"
        fill="white"
      />
      <path
        d="M24 23.3995C24 23.7309 23.7314 23.9995 23.4 23.9995H20.6C20.2686 23.9995 20 24.2681 20 24.5995V25.3995C20 25.7309 20.2686 25.9995 20.6 25.9995H25.4C25.7314 25.9995 26 25.7309 26 25.3995V20.5995C26 20.2681 25.7314 19.9995 25.4 19.9995H24.6C24.2686 19.9995 24 20.2681 24 20.5995V23.3995Z"
        fill="white"
      />
      <path
        d="M12 20.5995C12 20.2681 11.7314 19.9995 11.4 19.9995H10.6C10.2686 19.9995 10 20.2681 10 20.5995V25.3995C10 25.7309 10.2686 25.9995 10.6 25.9995H15.4C15.7314 25.9995 16 25.7309 16 25.3995V24.5995C16 24.2681 15.7314 23.9995 15.4 23.9995H12.6C12.2686 23.9995 12 23.7309 12 23.3995V20.5995Z"
        fill="white"
      />
    </svg>
  </div>
</Popover>

<style>
  div {
    cursor: pointer;
  }
</style>
