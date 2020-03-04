const puppeteer = require('puppeteer');
const eyes = require('../../index');

let browser;
beforeAll(
  async () =>
    (browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#tips
      ],
    })),
);
afterAll(() => browser.close());

eyes.it(`should work`, async () => {
  global.page = await browser.newPage();
  await global.page.setContent('<div>Hello</div>');
  expect(true).toEqual(true);
});
