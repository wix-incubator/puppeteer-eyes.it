const puppeteer = require('puppeteer');

const eyesUrl = process.argv[4];
const eyes = require(eyesUrl);
let browser;
beforeAll(async () => (browser = await puppeteer.launch()));
afterAll(() => browser.close());

eyes.it(`should work`, async () => {
  global.page = await browser.newPage();
  await global.page.goto('about:blank');
  expect(true).toEqual(true);
});
