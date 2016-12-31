// inspired by http://imweb.io/topic/57c6ea35808fd2fb204eef63

export default function abortable(promise) {
  let abort = null;

  let abortPromise = new Promise(function(resolve, reject) {
    abort = reject;
  });

  let wrappedPromise = Promise.race([
    promise,
    abortPromise
  ]);

  wrappedPromise.abort = abort;

  return wrappedPromise;
}
