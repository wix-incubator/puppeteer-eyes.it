const eyes = require('../index');

eyes.fit(`should work for eyes.fit`, async () => {
  await global.page.setContent('<div>Hi there!</div>');
  expect(await global.page.$eval('div', el => el.innerText)).toEqual(
    'Hi there!',
  );
});
