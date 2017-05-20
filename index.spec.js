const assert = require('assert');
const sinon = require('sinon');

const atEveryTurn = require('./index');

describe('at-every-turn', () => {
  let spy;

  beforeEach(() => {
    spy = sinon.spy();
  });

  it('executes your function without ruining anything', (done) => {
    const test = (result) => {
      assert.equal(0, spy.getCall(0).args[0]);
      assert.equal(1, spy.getCall(1).args[0]);
      assert.equal(2, spy.getCall(2).args[0]);
      assert.equal(result, 2);
      done();
    };

    atEveryTurn(spy, Promise.resolve(0))
      .then((x) => x + 1)
      .then((x) => x + 1)
      .then(test);
  });

  context('when a then fails', () => {
    it('still executes your function without ruining anything', () => {
      const test = (result) => {
        assert.equal(0, spy.getCall(0).args[0]);
        assert.equal(1, spy.getCall(1).args[0]);
        assert.equal(2, spy.getCall(2).args[0]);
        assert.equal(3, spy.getCall(3).args[0]);
        assert.equal(result, 3);
        done();
      };

      atEveryTurn(spy, Promise.resolve(0))
        .then((x) => x + 1)
        .then((x) => Promise.reject(x + 1))
        .then(() => 'skipped because of promise rejection')
        .catch((x) => x + 1)
        .then(test);
    });
  });

  context('when a catch fails', () => {
    it('still executes your function without ruining anything', () => {
      const test = (result) => {
        assert.equal(0, spy.getCall(0).args[0]);
        assert.equal(1, spy.getCall(1).args[0]);
        assert.equal(2, spy.getCall(2).args[0]);
        assert.equal(result, 2);
        done();
      };

      atEveryTurn(spy, Promise.resolve(0))
        .then((x) => x + 1)
        .catch((x) => Promise.reject(x + 1))
        .then(test);
    });
  });

  context('when the initial promise fails', () => {
    it('still executes your function without ruining anything', () => {
      const test = (result) => {
        assert.equal(0, spy.getCall(0).args[0]);
        assert.equal(0, result);
        done();
      };

      atEveryTurn(spy, Promise.reject(0))
        .catch(test);
    });
  });

  context('when then receives both onFulfilled and onRejected params', () => {
    const onFulfilled = (n) => n + 1;
    const onRejected = (n) => n - 1;

    context('and the initial promise is resolved', () => {
      it('still executes your function without ruining anything', (done) => {
        const testOnFulfilled = (result) => {
          assert.equal(0, spy.getCall(0).args[0]);
          assert.equal(1, spy.getCall(1).args[0]);
          assert.equal(1, result);
          done();
        };

        atEveryTurn(spy, Promise.resolve(0))
          .then(onFulfilled, onRejected)
          .then(testOnFulfilled);
      });
    });

    context('and the initial promise is rejected', () => {
      it('still executes your function without ruining anything', (done) => {
        const testOnRejected = (result) => {
          assert.equal(0, spy.getCall(0).args[0]);
          assert.equal(-1, spy.getCall(1).args[0]);
          assert.equal(-1, result);
          done();
        };

        atEveryTurn(spy, Promise.reject(0))
          .then(onFulfilled, onRejected)
          .then(testOnRejected);
      });
    });
  });
});
