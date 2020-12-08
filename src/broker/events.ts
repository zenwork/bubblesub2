import { Broker } from '../index'

export type BrokerPayload = {
  receiver: HTMLElement
  broker: {
    broker?: Broker
    parent?: HTMLElement
    found: boolean
  }
}

export function createHandshake(detail: BrokerPayload ) {
  return new CustomEvent('bubblesub-broker-handshake', {bubbles: true, detail})
}
