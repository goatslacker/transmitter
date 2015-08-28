function transmitter() {
  let pushDepth = 0
  const subscriptions = []

  const unsubscribe = (onChange) => {
    const id = subscriptions.indexOf(onChange)
    if (id >= 0) {
      if (pushDepth) subscriptions[id] = null
      else subscriptions.splice(id, 1)
    }
  }

  const subscribe = (onChange) => {
    subscriptions.push(onChange)
    const dispose = () => unsubscribe(onChange)
    return { dispose }
  }

  const push = (value) => {
    ++pushDepth
    try {
      subscriptions.forEach(subscription => subscription && subscription(value))
    }
    finally {
      if (!--pushDepth) {
        let id = -1
        while ((id = subscriptions.indexOf(null)) >= 0) subscriptions.splice(id, 1)
      }
    }
  }

  return { subscribe, push, unsubscribe }
}

module.exports = transmitter
