const path = require('path');
const uuid = require('uuid');
const {Eyes} = require('eyes.images');
const rewireGlobalsWithEyes = require('./eyes-with');
const rewireGlobalsWithoutEyes = require('./eyes-without');
require('dotenv').config();

const appName = require(path.join(process.cwd(), 'package.json')).name;
const eyes = new Eyes();

const eyesBatchUuid = process.env.IS_BUILD_AGENT
  ? process.env.BUILD_NUMBER
  : uuid.v4();

const eyesKey = process.env.EYES_API_KEY || process.env.APPLITOOLS_API_KEY;

if (eyesKey) {
  eyes.setOs(process.platform);
  eyes.setApiKey(eyesKey);
  rewireGlobalsWithEyes(eyes, appName);
} else {
  rewireGlobalsWithoutEyes(eyes);
}

if (process.env.APPLITOOLS_SERVER_URL) {
  eyes.setServerUrl(process.env.APPLITOOLS_SERVER_URL);
}

eyes.setBatch(appName, eyesBatchUuid);

module.exports = eyes;
