import { assert } from 'chai'
import sinon from 'sinon'
import transmitter from '../'

export default {
  'functions exist'() {
    const bus = transmitter()
    assert.isFunction(bus.subscribe)
    assert.isFunction(bus.publish)
    assert.isUndefined(bus.unsubscribe)
  },

  'can listen and dispose'() {
    const bus = transmitter()
    const result = bus.subscribe(function () { })
    assert.isObject(result)
    assert.isFunction(result.dispose)
    const undef = result.dispose()
    assert.isUndefined(undef)
  },

  'publishing'() {
    const bus = transmitter()
    const spy = sinon.spy()

    const subscription = bus.subscribe(spy)

    bus.publish('hello')

    assert.ok(spy.calledOnce)
    assert(spy.firstCall.args[0] === 'hello')

    subscription.dispose()
  },

  'unsub shortcut'() {
    const bus = transmitter()
    const spy = sinon.spy()
    const x = bus.subscribe(spy)
    x.dispose()

    bus.publish(1)

    assert(spy.callCount === 0)
  },

  'unsubscribe while publishing'() {
    const bus = transmitter()
    const subscription = bus.subscribe(() => subscription.dispose())
    const spy = sinon.spy()
    bus.subscribe(spy)

    bus.publish(1)

    assert(spy.calledOnce, 'spy was called once')
  },

  'unsubscribed while publishing'() {
    const spy1 = sinon.spy()

    const bus = transmitter()
    const subscription = bus.subscribe(() => {
      spy1()
      subscription.dispose()
    })

    const spy2 = sinon.spy()
    bus.subscribe(spy2)

    bus.publish(1)

    assert(spy1.calledOnce, 'spy1 was called once')
    assert(spy2.calledOnce, 'spy2 was called once')
  },

  'errors on subscriptions'() {
    const bus = transmitter()

    const subscription = bus.subscribe(() => {
      subscription.dispose()
    })

    bus.subscribe(() => {
      throw new Error('oops')
    })

    assert(bus.$subscriptions.length === 2)

    try {
      bus.publish(1)
    } catch (err) {
      // ignore error on purpose
    } finally {
      assert(bus.$subscriptions.length === 1)
    }
  },

  'does not call a subscription if its unsubscribed'() {
    const bus = transmitter()
    const spy = sinon.spy()

    let sub = null

    bus.subscribe(() => {
      sub.dispose()
    })

    sub = bus.subscribe(() => {
      spy()
    })

    bus.publish(33)

    assert(spy.callCount === 0)
  },

  'unsubscribing while in a subscription'() {
    const bus = transmitter()
    const spy1 = sinon.spy()
    const spy2 = sinon.spy()

    const a = bus.subscribe(spy1)
    const b = bus.subscribe(spy2)
    const c = bus.subscribe(() => {
      a.dispose()
      b.dispose()
      c.dispose()
    })

    bus.publish({})
    bus.publish({})

    assert.ok(spy1.calledOnce)
    assert.ok(spy2.calledOnce)
  },
}
