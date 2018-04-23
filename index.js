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

function isPassedWindowSizeArgument(argumentsObj) {
  return typeof argumentsObj[2] === 'object';
}

function eyesWithout(fn) {
  return function() {
    if (isPassedWindowSizeArgument(arguments)) {
      delete arguments[2];
    }
    return fn.apply(this, arguments);
  };
}

function eyesWith(fn) {
  return function() {
    let windowSize = eyes.defaultWindowSize;
    if (isPassedWindowSizeArgument(arguments)) {
      windowSize = arguments[2];
      delete arguments[2];
    }
    const spec = fn.apply(this, arguments);
    const hooked = spec.beforeAndAfterFns;
    spec.beforeAndAfterFns = function() {
      const result = hooked.apply(this, arguments);
      result.befores.unshift({
        fn(done) {
          eyes
            .open(appName, `eyes.it ${spec.getFullName()}`, windowSize)
            .then(done);
        },
        timeout: () => 30000,
      });
      result.afters.unshift({
        async fn(done) {
          try {
            const img = await global.page.screenshot();
            await eyes.checkImage(img, spec.getFullName());
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
  } else {
    eyes.it = eyesWithout(it);
    eyes.fit = eyesWithout(fit);
    eyes.test = eyesWithout(test);
  }

  eyes.defaultWindowSize = null;
  eyes.setBatch(appName, getBatchUUID());
}

_init();

module.exports = eyes;
