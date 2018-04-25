const {filterOptionsArg} = require('./utils');

const timeout = () => 30000;

const eyesWith = (eyes, appName) => fn => (...args) => {
  const [
    ,
    ,
    {version = '1.0.0', windowSize = eyes.defaultWindowSize} = {},
  ] = args;

  args = filterOptionsArg(args);

  const spec = fn.apply(this, args);
  const hooked = spec.beforeAndAfterFns;
  spec.beforeAndAfterFns = function(...beforeAndAfterArgs) {
    const result = hooked.apply(this, beforeAndAfterArgs);
    result.befores.unshift({
      fn(done) {
        eyes
          .open(
            appName,
            `eyes.it ${spec.getFullName()} version: ${version}`,
            windowSize,
          )
          .then(done);
      },
      timeout,
    });
    result.afters.unshift({
      async fn(done) {
        try {
          const img = await global.page.screenshot();
          await eyes.checkImage(img, `${spec.getFullName()} ${version}`);
          await eyes.close();
          done();
        } catch (err) {
          handleError(err, done);
        }
      },
      timeout,
    });
    return result;
  };
  return spec;
};

const handleError = (err, done) => {
  fail(err);
  done();
};

const rewireGlobalsWithEyes = (eyes, appName) => {
  const eyesWithWrapper = eyesWith(eyes, appName);
  eyes.it = eyesWithWrapper(it);
  eyes.fit = eyesWithWrapper(fit);
  eyes.test = eyesWithWrapper(test);
  eyes.test.only = eyesWithWrapper(test.only);
};

module.exports = rewireGlobalsWithEyes;
