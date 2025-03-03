import type { Level } from 'hls.js'
import { getContext } from 'svelte'
import { writable } from 'svelte/store'

import { EventBus } from './event-bus'

export type EventMap = {
  fullscreen_request: boolean
}

export type PlayerContextType = ReturnType<typeof createPlayerStore> & {
  eventBus: EventBus<EventMap>
}

export const playerContextKey = Symbol('player-key')

export function createPlayerStore() {
  return {
    vttUrl: writable(''),
    vttCues: writable<VTTCue[]>([]),
    currentLevel: writable(-1),
    levels: writable<Level[]>([]),
    muted: writable(false),
    paused: writable(true),
    volume: writable(1),
    duration: writable(0),
    currentTime: writable(0),
    playbackRate: writable(1.0),
    buffered: writable<TimeRanges>(),
    fullPage: writable(false),
    scale: writable(1),
  }
}
export function getPlayerContext() {
  return getContext<PlayerContextType>(playerContextKey)
}
