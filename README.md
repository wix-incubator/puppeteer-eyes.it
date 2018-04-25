# puppeteer-eyes.it

[![Build Status](https://travis-ci.org/wix-incubator/puppeteer-eyes.it.svg?branch=master)](https://travis-ci.org/wix-incubator/puppeteer-eyes.it)

Automatic screenshot comparison using [Puppeteer](https://github.com/GoogleChrome/puppeteer/), [Jest](https://github.com/facebook/jest) and [Eyes](https://applitools.com/).

## Getting started

```bash
  npm i --save-dev puppeteer-eyes.it
```

### Setup

1. Add Puppeteer's `page` on global (if you are using [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) you already have it on global)

2. Add your Applitools' eyes key to `EYES_API_KEY` env variable:
  - locally: add an `.env` file, with:
    ```
      EYES_API_KEY=<your key here>
    ```
  - on CI:
    Travis: go to your build's `options -> settings -> Environment Variables` and add `EYES_API_KEY` + your key

3. Change your test to use `eyes.it` or `eyes.test` instead of `it` or `test`

### Change screenshot baseline

In order to have a new screenshot [baseline](https://applitools.com/docs/topics/overview/overview-visual-testing.html) you can pass a version to your test:

```js
eyes.it('test description', async () => {
  // test goes here
}, {version: '1.0.1'} 
```

Default version is '1.0.0'


### How it works

`puppeteer-eyes.it` automatically take screenshot at the end of your test and sent it to Applitools eyes.




