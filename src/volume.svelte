<script lang="ts">
  import { sliderable } from './actions'
  import { getPlayerContext } from './player-context'
  let tuning = false
  const { volume, muted } = getPlayerContext()
  function handleClick() {
    if ($volume === 0) {
      $volume = 1
      $muted = false
    } else {
      $muted = !$muted
    }
  }
  function handleSliderMove(e: CustomEvent<number>) {
    $muted = false
    $volume = e.detail
  }
  function handleTuning() {
    tuning = true
    // TODO: may remove listener at onDestroy
    window.addEventListener('pointerup', () => (tuning = false), { once: true })
  }
  $: progress = `${($muted ? 0 : $volume) * 100}%`
</script>

<div class="volume">
  <div class="volume-button" on:click={handleClick} role="button">
    <svg
      width="36em"
      height="36em"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {#if $muted || $volume === 0}
        <path
          d="M9.85749 12.9343C9.38118 12.9505 9 13.3436 9 13.8262V21.8575C9 22.3504 9.39761 22.7499 9.8881 22.7499H13.1605L17.3717 25.7119C17.643 25.9027 17.9974 25.926 18.2911 25.7724C18.5848 25.6187 18.7691 25.3136 18.7691 24.9809V21.8888L9.85749 12.9343Z"
          fill="white"
        />
        <path
          d="M18.7691 15.5788L14.9113 11.7024L17.3717 9.97177C17.643 9.78096 17.9974 9.75765 18.2911 9.91132C18.5848 10.065 18.7691 10.3701 18.7691 10.7028V15.5788Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.70649 9.63404C10.0545 9.28436 10.6205 9.28436 10.9685 9.63404L25.375 24.11C25.7207 24.4573 25.7207 25.0187 25.375 25.366C25.027 25.7156 24.461 25.7156 24.113 25.366L9.70649 10.89C9.36084 10.5427 9.36084 9.98135 9.70649 9.63404Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M24.3136 20.9011C25.6328 18.3764 25.3943 15.2497 23.598 12.9428C23.2844 12.5401 23.2787 11.9578 23.6396 11.5969C24.0005 11.236 24.5899 11.2334 24.9134 11.6281C27.4147 14.6799 27.667 18.9585 25.6703 22.2578L24.3136 20.9011ZM22.9636 19.5511C23.5837 17.8618 23.3545 15.9313 22.2761 14.4203C21.9796 14.0049 21.3865 14.0084 21.0256 14.3693C20.6647 14.7302 20.6776 15.3115 20.9384 15.7503C21.3505 16.444 21.516 17.2436 21.4348 18.0223L22.9636 19.5511Z"
          fill="white"
        />
      {:else}
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M18.9 10.8889C18.9 10.5574 18.7133 10.2535 18.4156 10.1005C18.1179 9.9474 17.7588 9.97061 17.4839 10.1607L13.2163 13.1111H9.9C9.40294 13.1111 9 13.5091 9 14V22C9 22.4909 9.40294 22.8889 9.9 22.8889H13.2163L17.4839 25.8393C17.7588 26.0294 18.1179 26.0526 18.4156 25.8995C18.7133 25.7465 18.9 25.4426 18.9 25.1111V10.8889ZM23.7355 12.2144C23.3809 12.5646 23.3865 13.1343 23.6944 13.5261C25.7019 16.0811 25.7019 19.677 23.6944 22.2321C23.3865 22.6239 23.3809 23.1936 23.7355 23.5437C24.0838 23.8878 24.6483 23.8904 24.9614 23.5139C27.6795 20.2463 27.6795 15.5118 24.9614 12.2442C24.6483 11.8678 24.0838 11.8704 23.7355 12.2144ZM21.1898 14.8811C20.8353 15.2312 20.848 15.8 21.1033 16.2279C21.7655 17.3374 21.7655 18.7258 21.1033 19.8353C20.848 20.2632 20.8353 20.8319 21.1898 21.1821C21.5382 21.5261 22.1062 21.5298 22.3937 21.1335C23.7354 19.2844 23.7354 16.7787 22.3937 14.9297C22.1062 14.5334 21.5382 14.537 21.1898 14.8811Z"
          fill="white"
        />
      {/if}
    </svg>
  </div>

  <div
    class="slider"
    class:tuning
    use:sliderable
    on:pointerdown={handleTuning}
    on:slidermove={handleSliderMove}
  >
    <div class="tray" style:width={progress} />
    <div class="knob" style:--progress={progress} />
  </div>
</div>

<style>
  .volume {
    display: flex;
    align-items: center;
    --range-height: 2em;
  }
  .volume-button {
    cursor: pointer;
  }
  .slider {
    cursor: pointer;
    position: relative;
    width: 0;
    opacity: 0;
    margin: 0;
    transition: all 0.3s ease-in-out;
    height: var(--range-height);
    border-radius: var(--range-height);
    background-color: white;
  }
  .slider::before {
    content: '';
    position: absolute;
    top: -10em;
    left: 0;
    right: 0;
    bottom: -10em;
  }
  .volume:hover .slider,
  .tuning {
    width: 36em;
    opacity: 1;
    margin: 0 4em;
  }
  .tray {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--primary-color);
    border-radius: var(--range-height);
  }
  .knob {
    cursor: pointer;
    position: absolute;
    top: -3em;
    width: 8em;
    height: 8em;
    border-radius: 4em;
    left: calc(var(--progress) - 4em);
    background: var(--primary-color);
  }
</style>
