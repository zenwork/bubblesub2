import { expect }                         from '@open-wc/testing'
import { broker }                         from '../../src/broker'
import { addChild, dispatch }             from '../testutils'


describe('broker', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should attach to a body by default', () => {
    let broker0 = broker()
    let child = addChild()
    let event = dispatch(child, {receiver: child, broker: {found: false}})

    expect(event.detail.broker.found).to.be.true
    expect(event.detail.broker.parent).to.equal(window.document.body)

    broker0.shutdown()

  })

  it('should handle nothing after shutdown', () => {
    let bkr = broker()
    let child1 = addChild()
    let child2 = addChild()
    dispatch(child1, {receiver: child1, broker: {found: false}})



    expect(bkr.receivers.length).to.equal(1)
    expect(bkr.receivers[0]).to.equal(child1)

    bkr.shutdown()

    dispatch(child2, {receiver: child2, broker: {found: false}})

    expect(bkr.receivers.length).to.equal(1)
    expect(bkr.receivers[0]).to.equal(child1)


  })

  it('should attach to an arbitrary element', () => {
    let parent = addChild()
    const broker0 = broker(parent)
    const child = addChild('isolated', parent)
    let event = dispatch(child, {receiver: child, broker: {found: false}})

    expect(event.detail.broker.found).to.be.true
    expect(event.detail.broker.parent).to.equal(parent)

    broker0.shutdown()
  })

  it('should isolate from other broker', () => {
    let broker0 = broker()

    let parent1 = addChild('1')
    let broker1 = broker(parent1)
    const child1 = addChild('1-1', parent1)

    let parent2 = addChild('2')
    let broker2 = broker(parent2)
    const child2 = addChild('2-2', parent2)

    let event = dispatch(child1, {receiver: child1, broker: {found: false}})

    expect(event.detail.broker.found).to.be.true
    expect(event.detail.broker.parent).to.equal(parent1)
    expect(broker1.receivers.length).to.equal(1)

    let event2 = dispatch(child2, {receiver: child2, broker: {found: false}})

    expect(event2.detail.broker.found).to.be.true
    expect(event2.detail.broker.parent).to.equal(parent2)
    expect(broker2.receivers.length).to.equal(1)

    expect(broker0.receivers.length).to.equal(0)

    broker0.shutdown()
    broker1.shutdown()
    broker2.shutdown()
  })

  it('should isolate broker within broker', () => {

    let parent1 = addChild('1')
    const child1 = addChild('1-1', parent1)
    const child12 = addChild('1-2', parent1)
    const child0 = addChild('2-2')

    let broker0 = broker()
    let broker1 = broker(parent1)

    dispatch(child1, {receiver: child1, broker: {found: false}})
    dispatch(child12, {receiver: child12, broker: {found: false}})

    expect(broker1.receivers.length).to.equal(2)

    dispatch(child0, {receiver: child0, broker: {found: false}})

    expect(broker0.receivers.length).to.equal(1)

    broker0.shutdown()
    broker1.shutdown()
  })
})
