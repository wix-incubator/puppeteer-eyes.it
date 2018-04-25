function eyesWithout(fn) {
  return function(...args) {
    args = args.filter((arg, i) => {
      if (i === 2 && typeof arg === 'object') {
        return false;
      }
      return true;
    });
    return fn.apply(this, args);
  };
}

module.exports = eyesWithout;
