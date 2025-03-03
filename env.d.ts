/// <reference types="svelte" />

declare namespace svelteHTML {
  interface HTMLAttributes {
    'on:slidermove'?: (event: CustomEvent<number>) => void
    'on:sliderend'?: (event: CustomEvent) => void
  }
}
