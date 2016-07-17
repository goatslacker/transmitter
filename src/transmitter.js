function transmitter() {
  const subscriptions = []
  let nowDispatching = false
  let toUnsubscribe = {}

  const unsubscribe = (id) => {
    if (nowDispatching) {
      toUnsubscribe[id] = 1
      return
    }
    subscriptions.splice(id, 1)
  }

  const subscribe = (onChange) => {
    const id = subscriptions.push(onChange)
    const dispose = () => unsubscribe(id - 1)
    return { dispose }
  }

  const publish = (...args) => {
    nowDispatching = true
    try {
      subscriptions.forEach(
        (subscription, id) => toUnsubscribe[id] || subscription(...args)
      )
    } finally {
      nowDispatching = false
      Object.keys(toUnsubscribe).forEach(unsubscribe)
      toUnsubscribe = {}
    }
  }

  return {
    publish,
    subscribe,
    $subscriptions: subscriptions,
  }
}

module.exports = transmitter
