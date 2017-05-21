const wrap = (fn, promise) => ({
  then: (onFulfilled, onRejected) =>
    wrap(fn, promise.then(onFulfilled, onRejected)
      .then((result) => {
        fn(result);
        return result;
      })),
  catch: onRejected =>
    wrap(fn, promise.catch(onRejected)
      .then((result) => {
        fn(result);
        return result;
      })),
});

module.exports = (fn, promise) =>
  wrap(fn, promise.then(
    (result) => {
      fn(result);
      return result;
    },
    (result) => {
      fn(result);
      return Promise.reject(result);
    },
  ));
