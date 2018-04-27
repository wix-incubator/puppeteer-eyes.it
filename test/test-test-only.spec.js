const eyes = require('../index');

eyes.test.only(`should work for eyes.test.only`, async () => {
  await global.page.setContent('<div>Hi there!</div>');
  expect(await global.page.$eval('div', el => el.innerText)).toEqual(
    'Hi there!',
  );
});
