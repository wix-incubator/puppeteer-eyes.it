const eyes = require('../index');

eyes.test.only(`should work for eyes.test.only`, async () => {
  await global.page.goto('http://localhost:3000');
  expect(await global.page.$eval('div', el => el.innerText)).toEqual(
    'Hi there!',
  );
});
