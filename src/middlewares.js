import isArray from 'lodash/isArray';
import reduceRight from 'lodash/reduceRight';

export default function middlewares(mids, target) {
  if (typeof target !== 'function') {
    throw new Error(
      'Expected target wrapped with middlewares to be a function'
    );
  }

  if (!isArray(mids)) {
    throw new Error(
      'Expected middlewares to be an array'
    );
  }

  return reduceRight(
    mids,
    function wrapMiddlewares(next, middleware) {
      return (...args) => Promise.resolve().then(() => {
        return Promise.all([
          middleware(next, ...args)
        ]).then(([ result ]) => result);
      });
    },
    (...args) => Promise.all([
      target(...args)
    ]).then(([ result ]) => result)
  );
}
