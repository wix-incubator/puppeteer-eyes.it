const path = require('path');
const uuid = require('uuid');
const {Eyes} = require('eyes.images');
require('dotenv').config();

const appName = require(path.join(process.cwd(), 'package.json')).name;
const eyes = new Eyes();

function handleError(err, done) {
  fail(err);
  done();
}

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

function eyesWith(fn) {
  return function(...args) {
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
}

function getBatchUUID() {
  return process.env.EYES_BATCH_UUID;
}

function setOnceBatchUUID(_uuid) {
  if (!getBatchUUID()) {
    process.env.EYES_BATCH_UUID = _uuid;
  }
}

function _init() {
  if (process.env.IS_BUILD_AGENT) {
    process.env.EYES_BATCH_UUID = process.env.BUILD_NUMBER;
  }

  setOnceBatchUUID(uuid.v4());

  if (process.env.EYES_API_KEY) {
    eyes.setApiKey(process.env.EYES_API_KEY);
    eyes.it = eyesWith(it);
    eyes.fit = eyesWith(fit);
    eyes.test = eyesWith(test);
    eyes.test.only = eyesWith(test.only);
  } else {
    eyes.it = eyesWithout(it);
    eyes.fit = eyesWithout(fit);
    eyes.test = eyesWith(test);
    eyes.test.only = eyesWithout(test.only);
  }

  eyes.defaultWindowSize = null;
  eyes.setBatch(appName, getBatchUUID());
}

_init();

module.exports = eyes;
