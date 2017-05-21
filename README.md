# At Every Turn

Do *something* at every step in your promise chain.

## Installation

```
npm install --save at-every-turn
```

## Usage

Pass a function and an initial promise to `atEveryTurn`. The function will be executed against the result of each promise in the ensuing promise chain - including the initial promise.

For example, executing this code:

```js
const atEveryTurn = require('at-every-turn');

atEveryTurn(console.log, Promise.resolve(0))
  .then((x) => x + 1)
  .then((x) => x + 1);
```

Will produce this console output:

```shell
0
1
2
```

It also handles `catch` and the use of `then` with `onFulfilled` and `onRejected` params.
