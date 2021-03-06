const {filterOptionsArg, timeout} = require('./utils');

const eyesWith = (eyes, appName) => fn => (...args) => {
  const [, , {version = '1.0.0'} = {}] = args;

  args = filterOptionsArg(args);

  const spec = fn.apply(this, args);
  const hooked = spec.beforeAndAfterFns;
  spec.beforeAndAfterFns = function(...beforeAndAfterArgs) {
    const result = hooked.apply(this, beforeAndAfterArgs);

    result.afters.unshift({
      fn: afterFunction({eyes, appName, spec, version}),
      timeout,
    });
    return result;
  };
  return spec;
};

const afterFunction = ({eyes, appName, spec, version}) => async done => {
  try {
    const img = await global.page.screenshot({fullPage: true});
    await sendToEyes({
      eyes,
      img,
      appName,
      specName: spec.getFullName(),
      version,
    });
    done();
  } catch (err) {
    handleError(err, done);
  }
};

const handleError = (err, done) => {
  fail(err);
  done();
};

const sendToEyes = async ({eyes, img, appName, specName, version}) => {
  try {
    await eyes.open(appName, `eyes.it ${specName} (version: ${version})`);
    await eyes.checkImage(img, `${specName} ${version}`);
  } catch (e) {
    await eyes.abortIfNotClosed();
    throw e;
  }
  await eyes.close();
  if (process.env.EYES_TESTS) {
    console.log(`eyes comparison succeed. Image key: ${specName} ${version}`);
  }
};

const rewireGlobalsWithEyes = (eyes, appName) => {
  const eyesWithWrapper = eyesWith(eyes, appName);
  eyes.it = eyesWithWrapper(it);
  eyes.fit = eyesWithWrapper(fit);
  eyes.test = eyesWithWrapper(test);
  eyes.test.only = eyesWithWrapper(test.only);
};

module.exports = rewireGlobalsWithEyes;
