const {filterOptionsArg, timeout} = require('./utils');

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

    result.afters.unshift({
      async fn(done) {
        try {
          const img = await global.page.screenshot({fullPage: true});
          await sendToEyes({
            eyes,
            img,
            appName,
            specName: spec.getFullName(),
            version,
            windowSize,
          });
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

const sendToEyes = async ({
  eyes,
  img,
  appName,
  specName,
  version,
  windowSize,
}) => {
  await eyes.open(
    appName,
    `eyes.it ${specName} version: ${version}`,
    windowSize,
  );
  await eyes.checkImage(img, `${specName} ${version}`);
  await eyes.close();
};

const rewireGlobalsWithEyes = (eyes, appName) => {
  const eyesWithWrapper = eyesWith(eyes, appName);
  eyes.it = eyesWithWrapper(it);
  eyes.fit = eyesWithWrapper(fit);
  eyes.test = eyesWithWrapper(test);
  eyes.test.only = eyesWithWrapper(test.only);
};

module.exports = rewireGlobalsWithEyes;
