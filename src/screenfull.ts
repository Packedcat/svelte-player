type FSDocument = Document & {
  mozCancelFullScreen: Document['exitFullscreen']
  mozFullScreenEnabled: Document['fullscreenEnabled']
  mozFullScreenElement: Document['fullscreenElement']
  webkitExitFullscreen: Document['exitFullscreen']
  webkitFullscreenEnabled: Document['fullscreenEnabled']
  webkitFullscreenElement: Document['fullscreenElement']
}
type FSHTMLElement = HTMLElement & {
  mozRequestFullScreen: HTMLElement['requestFullscreen']
  webkitRequestFullscreen: HTMLElement['requestFullscreen']
}

class ScreenFull {
  get isFullscreen() {
    return Boolean((document as FSDocument)[this.APINameMap.fullscreenElement])
  }
  get element() {
    return (document as FSDocument)[this.APINameMap.fullscreenElement]
  }
  get isEnabled() {
    return Boolean((document as FSDocument)[this.APINameMap.fullscreenEnabled])
  }
  get APINameMap(): {
    requestFullscreen: 'requestFullscreen' | 'webkitRequestFullscreen' | 'mozRequestFullScreen'
    exitFullscreen: 'exitFullscreen' | 'webkitExitFullscreen' | 'mozCancelFullScreen'
    fullscreenElement: 'fullscreenElement' | 'webkitFullscreenElement' | 'mozFullScreenElement'
    fullscreenEnabled: 'fullscreenEnabled' | 'webkitFullscreenEnabled' | 'mozFullScreenEnabled'
    fullscreenchange: 'fullscreenchange' | 'webkitfullscreenchange' | 'mozfullscreenchange'
    fullscreenerror: 'fullscreenerror' | 'webkitfullscreenerror' | 'mozfullscreenerror'
  } {
    return 'exitFullscreen' in document
      ? {
          requestFullscreen: 'requestFullscreen',
          exitFullscreen: 'exitFullscreen',
          fullscreenElement: 'fullscreenElement',
          fullscreenEnabled: 'fullscreenEnabled',
          fullscreenchange: 'fullscreenchange',
          fullscreenerror: 'fullscreenerror',
        }
      : 'webkitExitFullscreen' in document // TODO old webkit support
      ? {
          requestFullscreen: 'webkitRequestFullscreen',
          exitFullscreen: 'webkitExitFullscreen',
          fullscreenElement: 'webkitFullscreenElement',
          fullscreenEnabled: 'webkitFullscreenEnabled',
          fullscreenchange: 'webkitfullscreenchange',
          fullscreenerror: 'webkitfullscreenerror',
        }
      : {
          requestFullscreen: 'mozRequestFullScreen',
          exitFullscreen: 'mozCancelFullScreen',
          fullscreenElement: 'mozFullScreenElement',
          fullscreenEnabled: 'mozFullScreenEnabled',
          fullscreenchange: 'mozfullscreenchange',
          fullscreenerror: 'mozfullscreenerror',
        }
  }

  request(element?: HTMLElement, option?: FullscreenOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const onFullScreenEntered = () => {
        document.removeEventListener(this.APINameMap.fullscreenchange, onFullScreenEntered)
        this.off(onFullScreenEntered)
        resolve()
      }
      this.on(onFullScreenEntered)
      const el = element || document.documentElement
      const promise = (el as FSHTMLElement)[this.APINameMap.requestFullscreen](option)
      if (promise instanceof Promise) {
        promise.then(onFullScreenEntered).catch(reject)
      }
    })
  }
  exit(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isFullscreen) {
        resolve()
        return
      }
      const onFullScreenExit = () => {
        this.off(onFullScreenExit)
        resolve()
      }
      this.on(onFullScreenExit)
      const promise = (document as FSDocument)[this.APINameMap.exitFullscreen]()
      if (promise instanceof Promise) {
        promise.then(onFullScreenExit).catch(reject)
      }
    })
  }
  toggle(element?: HTMLElement, option?: FullscreenOptions) {
    return this.isFullscreen ? this.exit() : this.request(element, option)
  }
  on(cb: () => void) {
    document.addEventListener(this.APINameMap.fullscreenchange, cb)
  }
  off(cb: () => void) {
    document.removeEventListener(this.APINameMap.fullscreenchange, cb)
  }
}

export const screenfull = new ScreenFull()
