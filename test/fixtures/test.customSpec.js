const puppeteer = require('puppeteer');

const eyesUrl = process.argv[4];
const eyes = require(eyesUrl);
let browser;
beforeAll(async () =>
  (browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#tips
    ],
  })));
afterAll(() => browser.close());

eyes.it(`should work`, async () => {
  global.page = await browser.newPage();
  await global.page.setContent('<div>Hello World</div>');
  expect(true).toEqual(true);
});
