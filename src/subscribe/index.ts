import { createHandshake } from '../broker/events'
import { Subscription }                   from '../index'


/**
 * subscription API
 * @param subscriber
 * @param {string} name - unique subscription name
 * @param {string} filter - optional name descriminator to filter at source. not providing it may result in all or no callbacks
 * depending on how the publication is setup
 */
export function subscribe<T>(subscriber: HTMLElement, name: string, filter: string = '*'): Subscription<T> {

  const noop = () => {}
  let running = false

  let subscription: Subscription<T> = {

    onSubscribed: (lambda: () => void) => {
      running = true
      run(subscriber, name, filter, lambda)
      return subscription
    },

    then: (lambda: (T) => T) => {
      if (!running) run(subscriber, name, filter, noop)
      return Promise.resolve(lambda({} as T))
    }
  }

  return subscription
}

function run(receiver: HTMLElement, name: string, filter: string, onSubscribed: () => void) {
  let event = createHandshake({receiver, broker: {found: false}})
  let id = setInterval(() => {
    receiver.dispatchEvent(event)
    let broker = event.detail.broker.broker
    if (broker) {
      broker.subscribe(receiver, name, filter)
      clearInterval(id)
      onSubscribed()
    }
  }, 100)
}
