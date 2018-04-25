const path = require('path');
const uuid = require('uuid');
const {Eyes} = require('eyes.images');
const eyesWith = require('./eyes-with');
const eyesWithout = require('./eyes-without');
require('dotenv').config();

const appName = require(path.join(process.cwd(), 'package.json')).name;
const eyes = new Eyes();

function getBatchUUID() {
  return process.env.EYES_BATCH_UUID;
}

function setOnceBatchUUID(_uuid) {
  if (!getBatchUUID()) {
    process.env.EYES_BATCH_UUID = _uuid;
  }
}

if (process.env.IS_BUILD_AGENT) {
  process.env.EYES_BATCH_UUID = process.env.BUILD_NUMBER;
}

setOnceBatchUUID(uuid.v4());

if (process.env.EYES_API_KEY) {
  eyes.setApiKey(process.env.EYES_API_KEY);
  const eyesWithWrapper = eyesWith(eyes, appName);
  eyes.it = eyesWithWrapper(it);
  eyes.fit = eyesWithWrapper(fit);
  eyes.test = eyesWithWrapper(test);
  eyes.test.only = eyesWithWrapper(test.only);
} else {
  eyes.it = eyesWithout(it);
  eyes.fit = eyesWithout(fit);
  eyes.test = eyesWithout(test);
  eyes.test.only = eyesWithout(test.only);
}

eyes.defaultWindowSize = null;
eyes.setBatch(appName, getBatchUUID());

module.exports = eyes;
