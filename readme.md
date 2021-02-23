I like callbacks more when you need to wait for user input.

Set callback on player property, and when user clicks element, call callback.
Otherwise it's like
```js
await player.turn()
class Player {
  async turn() {
    return new Promise((resolve, reject) => {
      button.addEventListener('click', () => resolve())
    })
  }
}
```
and then you have to worry about subbing/unsubbing from event listeners
or
```js
await player.turn()
class Player {
  done = null
  constructor() {
    button = document.createElement('button')
    button.addEventListener('click', () => {
      if(this.done) this.done()
    })
  }
  async turn() {
    return new Promise((resolve, reject) => {
      this.done = resolve
    })
  }
}
```
maybe this last one isn't so bad! I had written it poorly the first time though