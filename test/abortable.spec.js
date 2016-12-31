import expect from 'expect';
import abortable from '../src/abortable';

describe('Abortable Util', () => {
  it('wraps a promise to support aborting', () => {
    let target = new Promise((resolve) => {
      setTimeout(function() {
        resolve('timeout');
      }, 2000);
    });

    let wrapped = abortable(target);

    let result = wrapped.then(() => {
      throw new Error('never reach here');
    }, (msg) => {
      expect(msg).toEqual('abort');
    });

    wrapped.abort('abort');

    return result;
  });
});
