import { expect }    from '@open-wc/testing'
import { Broker }    from '../../src'
import { broker }    from '../../src/broker'
import { subscribe } from '../../src/subscribe'
import { addChild }  from '../testutils'

describe('subscribe', () => {

  let brkr: Broker

  beforeEach(() => {
    if (brkr) brkr.shutdown()
    document.body.innerHTML = ''
    brkr = broker()
  })

  it('should subscribe even when nothing is there', (done) => {

    let child = addChild('1')

    subscribe(child, 'foobar')
      .onSubscribed(() => {
        expect(brkr.isSubscribed(child,'foobar')).to.be.true
        done()
      })
  })

})
