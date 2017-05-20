const wrap = (fn, promise) => {
  const applyFn = (result) => {
    fn(result);
    return result;
  };

  return {
    then: (thenner, catcher) => wrap(fn, promise.then(thenner, catcher).then(applyFn, applyFn)),
    catch: (catcher) => wrap(fn, promise.then(catcher).catch(applyFn)),
  };
};

module.exports = (fn, promise) => {
  const applyFn = (result) => {
    fn(result);
    return result;
  };

  const applyFnAndReject = (result) => {
    fn(result);
    return Promise.reject(result);
  };

  return wrap(fn, promise.then(applyFn, applyFnAndReject));
};
