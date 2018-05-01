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

if (process.env.EYES_API_KEY) {
  eyes.setOs(process.platform);
  eyes.setApiKey(process.env.EYES_API_KEY);
  rewireGlobalsWithEyes(eyes, appName);
} else {
  rewireGlobalsWithoutEyes(eyes);
}

eyes.setBatch(appName, eyesBatchUuid);

module.exports = eyes;
