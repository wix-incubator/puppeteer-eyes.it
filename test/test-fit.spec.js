const eyes = require('../index');

eyes.fit(`should work for eyes.fit`, async () => {
  const divText = 'Hi there!';
  await global.page.setContent(`<div>${divText}</div>`);

  expect(await global.page.$eval('div', el => el.innerText)).toEqual(divText);
});
