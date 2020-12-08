
export type Broker = {
  subscribe: <T>(subscriber: HTMLElement, name: string, filter: string) => void
  parent: HTMLElement,
  receivers: HTMLElement[]
  shutdown: () => void
  isSubscribed(subscriber: HTMLElement, name: string): boolean
}

/**
 * initialize an element so that components can publish or subscribe
 */
export type createBroker = (target?: HTMLElement) => Broker

/**
 * API for distributing a publication
 */
export type Publication<T> = {
  /**
   * publish the next object
   * @param {T} object
   * @param {string} filter
   */
  next: (object: T, filter?: string) => void;
  /**
   * The buffer of items already published
   * @returns {T[]}
   */
  buffer: () => T[];
  /**
   * Clear the buffer of published items
   */
  clear: () => void
}

/**
 * publisher API
 */
export type publish = <T>(name: string) => Publication<T>

/**
 * Subcription provides a simple mapping API
 */
export type Subscription<T> = {
  // filter: (lambda: (T) => boolean) => Subscription<T>;
  // map: (lambda: (T) => any) => Subscription<T>;
  onSubscribed: (lambda: () => void) => Subscription<T>,
  then: (lambda: (T) => T) => Promise<T>
}

/**
 * subscription API
 * @param {string} name - unique subscription name
 * @param {string} filter - optional name descriminator to filter at source. not providing it may result in all or no callbacks
 * depending on how the publication is setup
 */
// export type subscriber<T> = (name: string, filter?: string) => Subscription<T>

/**
 * Singleton provider
 */
export type provide<T> = (name: string, provided: any) => Promise<T>

/**
 * Singleton injector
 */
export type inject<T> = (name: string) => Promise<T>
