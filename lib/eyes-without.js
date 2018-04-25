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

function rewireGlobalsWithoutEyes(eyes) {
  eyes.it = eyesWithout(it);
  eyes.fit = eyesWithout(fit);
  eyes.test = eyesWithout(test);
  eyes.test.only = eyesWithout(test.only);
}
module.exports = rewireGlobalsWithoutEyes;
