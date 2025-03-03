type EventHandler<T> = (data: T) => void

export class EventBus<T> {
  private subscribers: { [EventType in keyof T]?: EventHandler<T[EventType]>[] } = {}

  subscribe<EventType extends keyof T>(
    eventType: EventType,
    handler: EventHandler<T[EventType]>,
    once: boolean = false,
  ): void {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = []
    }

    if (once) {
      const onceHandler: EventHandler<T[EventType]> = (data) => {
        handler(data)
        this.unsubscribe(eventType, onceHandler)
      }
      this.subscribers[eventType]!.push(onceHandler)
    } else {
      this.subscribers[eventType]!.push(handler)
    }
  }

  unsubscribe<EventType extends keyof T>(
    eventType: EventType,
    handler: EventHandler<T[EventType]>,
  ): void {
    const handlers = this.subscribers[eventType]
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }

  publish<EventType extends keyof T>(eventType: EventType, data: T[EventType]): void {
    const handlers = this.subscribers[eventType]
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }
}
