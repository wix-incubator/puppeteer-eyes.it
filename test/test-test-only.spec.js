const eyes = require('../index');

eyes.test.only(`should work for eyes.test.only`, async () => {
  const divText = 'Hi there!';
  await global.page.setContent(`<div>${divText}</div>`);
  expect(await global.page.$eval('div', el => el.innerText)).toEqual(divText);
});
