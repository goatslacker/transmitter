"use strict";

function transmitter() {
  var pushDepth = 0;
  var subscriptions = [];

  var unsubscribe = function unsubscribe(onChange) {
    var id = subscriptions.indexOf(onChange);
    if (id >= 0) {
      if (pushDepth) subscriptions[id] = null;else subscriptions.splice(id, 1);
    }
  };

  var subscribe = function subscribe(onChange) {
    subscriptions.push(onChange);
    var dispose = function dispose() {
      return unsubscribe(onChange);
    };
    return { dispose: dispose };
  };

  var push = function push(value) {
    ++pushDepth;
    try {
      subscriptions.forEach(function (subscription) {
        return subscription && subscription(value);
      });
    } finally {
      if (! --pushDepth) {
        var id = -1;
        while ((id = subscriptions.indexOf(null)) >= 0) subscriptions.splice(id, 1);
      }
    }
  };

  return { subscribe: subscribe, push: push, unsubscribe: unsubscribe };
}

module.exports = transmitter;