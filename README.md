# puppeteer-eyes.it

[![Build Status](https://travis-ci.org/wix-incubator/puppeteer-eyes.it.svg?branch=master)](https://travis-ci.org/wix-incubator/puppeteer-eyes.it)

Automatic screenshot comparison using [Puppeteer](https://github.com/GoogleChrome/puppeteer/), [Jest](https://github.com/facebook/jest) and [Applitools Eyes](https://applitools.com/).

## Getting started

```bash
  npm i --save-dev puppeteer-eyes.it
```

### Setup

1. Add Puppeteer's `page` on global (if you are using [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) you already have it on global)

2. Require `puppeteer-eyes.it`:

```js
const eyes = require('puppeteer-eyes.it');
```

3. Add your Applitools' eyes [key](https://applitools.com/docs/topics/overview/obtain-api-key.html) to `APPLITOOLS_API_KEY` env variable:

    #### CI

    Travis: go to your build's `options -> settings -> Environment Variables` and add `APPLITOOLS_API_KEY` + your key

    #### locally

    add an `.env` file, with:

    ```
      APPLITOOLS_API_KEY=<your key here>
    ```

    - this step is not mandatory - you should use it if you want to use eyes when running locally.
    - **you should put your `.env` file in git ignore!!!**


  **Key name change** `EYES_API_KEY` is being replaced with `APPLITOOLS_API_KEY`. For now, we support both of them.

4. Change your test to use `eyes.it` or `eyes.test` instead of `it` or `test`

### Change screenshot baseline

In order to have a new screenshot [baseline](https://applitools.com/docs/topics/overview/overview-visual-testing.html) you can pass a version to your test:

```js
eyes.it('test description', async () => {
    // test goes here
}, {version: '1.0.1'});

```

Default version is '1.0.0'


### How does it work

`puppeteer-eyes.it` automatically takes a screenshot at the end of your test and sends it to Applitools eyes. When Eyes detects a diff in  the screenshot, **your build will fail** and you will have a link to Applitools site with the visual diff of the screenshot.


### Example

```js
  const puppeteer = require('puppeteer');
  const eyes = require('puppeteer-eyes.it');
  let page;
  beforeAll(async () => {
    const browser = await puppeteer.launch();
    page = global.page = await browser.newPage();
  });
  afterAll(() => browser.close());
  eyes.it('test description', async () => {
    await page.goto('http://www.wix.com');
    expect(await page.title()).toEqual('Free Website Builder | Create a Free Website | Wix.com');
  });
```



