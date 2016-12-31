import expect from 'expect';
import middlewares from '../src/middlewares';

describe('Middlewares Util', () => {
  it('stacks middlewares to hack an interface', () => {
    let mids = [
      function(next, src) {
        src.push('mid1 head');

        let result = next(src);

        return result.then((ret) => {
          ret.push('mid1 tail');

          return ret;
        });
      },
      function(next, src) {
        src.push('mid2 head');

        let result = next(src);

        return result.then((ret) => {
          ret.push('mid2 tail');

          return ret;
        });
      }
    ];

    let target = function(src) {
      src.push('target');
      return src;
    };

    let wrapped = middlewares(mids, target);

    return wrapped(['start']).then((ret) => {
      expect(ret).toEqual([
        'start',
        'mid1 head',
        'mid2 head',
        'target',
        'mid2 tail',
        'mid1 tail'
      ]);
    });
  });

  it('supports Promise in middlewares and target', () => {
    let mids = [
      function(next, src) {
        return new Promise((resolve) => {
          setTimeout(function() {
            src.push('mid1 head');
            resolve(src);
          }, 10);
        }).then((_src) => {
          return next(_src);
        }).then((ret) => {
          return new Promise((resolve) => {
            setTimeout(function() {
              ret.push('mid1 tail');
              resolve(ret);
            }, 10);
          });
        });
      }
    ];

    let target = function(src) {
      return new Promise((resolve) => {
        setTimeout(function() {
          src.push('target');
          resolve(src);
        }, 10);
      });
    };

    let wrapped = middlewares(mids, target);

    return wrapped(['start']).then((ret) => {
      expect(ret).toEqual([
        'start',
        'mid1 head',
        'target',
        'mid1 tail'
      ]);
    });
  });

  it('throws error if middlewares is not an array', () => {
    expect(() => {
      middlewares(123, function() {});
    }).toThrow(/Expected middlewares/);

    expect(() => {
      middlewares('123', function() {});
    }).toThrow(/Expected middlewares/);

    expect(() => {
      middlewares({}, function() {});
    }).toThrow(/Expected middlewares/);

    expect(() => {
      middlewares(function() {}, function() {});
    }).toThrow(/Expected middlewares/);
  });

  it('throws error if target is not a function', () => {
    expect(() => {
      middlewares([], 123);
    }).toThrow(/Expected target/);

    expect(() => {
      middlewares([], '123');
    }).toThrow(/Expected target/);

    expect(() => {
      middlewares([], {});
    }).toThrow(/Expected target/);

    expect(() => {
      middlewares([], []);
    }).toThrow(/Expected target/);
  });
});
