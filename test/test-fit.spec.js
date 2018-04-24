const eyes = require('../index');

eyes.fit(`should work for eyes.fit`, async () => {
  await global.page.goto('http://localhost:3000');
  expect(await global.page.$eval('div', el => el.innerText)).toEqual(
    'Hi there!',
  );
});
