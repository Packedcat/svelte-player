import type { Action } from 'svelte/action'

export const sliderable: Action<HTMLElement> = (node) => {
  function seek(ev: PointerEvent) {
    const { left, width } = node.getBoundingClientRect()

    let detail = (ev.clientX - left) / width
    if (detail < 0) detail = 0
    if (detail > 1) detail = 1
    node.dispatchEvent(new CustomEvent('slidermove', { detail }))
  }
  function handlePointerDown(e: PointerEvent) {
    seek(e)

    window.addEventListener('pointermove', seek)

    window.addEventListener(
      'pointerup',
      () => {
        node.dispatchEvent(new CustomEvent('sliderend'))
        window.removeEventListener('pointermove', seek)
      },
      { once: true },
    )
  }
  node.addEventListener('pointerdown', handlePointerDown)
  return {
    destroy: () => {
      node.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', seek)
    },
  }
}
