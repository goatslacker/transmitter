# transmitter

> Dead simple pub-sub

## API

### subscribe(onChange: () => any): { dispose: () => void }

Subscribes to change events. Returns an object which contains the method `dispose` which removes the current subscription.

### publish(...payload: any): void

Emit a change to all the subscribers.

## Example

```js
const bus = transmitter()

bus.subscribe(result => console.log(result))

bus.publish({ foo: 'bar' })
```

## License

[MIT](http://josh.mit-license.org)
