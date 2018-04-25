const eyesWith = (eyes, appName) => fn => (...args) => {
  const [
    ,
    ,
    {version = '1.0.0', windowSize = eyes.defaultWindowSize} = {},
  ] = args;

  args = args.filter((arg, i) => {
    if (i === 2 && typeof arg === 'object') {
      return false;
    }
    return true;
  });

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
      timeout: () => 30000,
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
      timeout: () => 30000,
    });
    return result;
  };
  return spec;
};

function handleError(err, done) {
  fail(err);
  done();
}

module.exports = eyesWith;
