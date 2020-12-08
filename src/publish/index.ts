export function publish<T>(name: string) {

  let publication = {
    next: (object: T, id: string) => {},
    length: () => {},
    clean: () => {}
  }
  return publication
}
