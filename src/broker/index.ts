import { Broker, createBroker } from '../index'


function createBrokerImpl(target: HTMLElement = window.document.body): Broker {
  const parent: HTMLElement = target
  const receivers: HTMLElement[] = []
  const subscriptions: { subscriber: HTMLElement, name: string, filter: string }[] = []

  let broker = {
    parent,
    receivers,
    shutdown: () => {parent.removeEventListener('bubblesub-broker-handshake', listener)},
    subscribe(subscriber: HTMLElement, name: string, filter: string) {
      subscriptions.push({subscriber, name, filter})
    },
    isSubscribed(subscriber: HTMLElement, name: string): boolean {
      return subscriptions.some(s => s.subscriber === subscriber && s.name === name)
    }
  }

  let listener = (event) => {
    if (isCustomEvent(event)) {
      event.detail.broker.found = true
      event.detail.broker.parent = target
      event.detail.broker.broker = broker
      receivers.push(event.detail.receiver)
    }
    event.stopImmediatePropagation()
  }

  target.addEventListener(
    'bubblesub-broker-handshake',
    listener
  )


  return broker
}

export const broker: createBroker = createBrokerImpl


function isCustomEvent(event: Event): event is CustomEvent {
  return (event as CustomEvent).detail !== undefined
}
