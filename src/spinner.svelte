<script lang="ts">
  import TextContent from './text-content.svelte'
</script>

<div class="spinner">
  <svg
    width="40em"
    height="40em"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="20.2004"
      cy="32.5273"
      r="5"
      transform="rotate(135 20.2004 32.5273)"
      fill="#F3C2FF"
    />
    <circle cx="7.4719" cy="19.7988" r="5" transform="rotate(135 7.4719 19.7988)" fill="#B938D9" />
    <circle
      cx="20.2004"
      cy="7.07129"
      r="5"
      transform="rotate(135 20.2004 7.07129)"
      fill="#F3C2FF"
    />
    <circle
      cx="32.9289"
      cy="19.7988"
      r="5"
      transform="rotate(135 32.9289 19.7988)"
      fill="#B938D9"
    />
  </svg>
  <TextContent>视频加载中</TextContent>
</div>

<style>
  .spinner {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  svg {
    animation: spin 1s linear infinite;
    margin-bottom: 12em;
  }
</style>
