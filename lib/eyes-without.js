const {filterOptionsArg} = require('./utils');

const eyesWithout = fn => (...args) => {
  args = filterOptionsArg(args);
  return fn.apply(this, args);
};

const rewireGlobalsWithoutEyes = eyes => {
  eyes.it = eyesWithout(it);
  eyes.fit = eyesWithout(fit);
  eyes.test = eyesWithout(test);
  eyes.test.only = eyesWithout(test.only);
};

module.exports = rewireGlobalsWithoutEyes;
