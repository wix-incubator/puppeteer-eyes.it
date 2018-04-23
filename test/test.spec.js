const eyes = require('../index');

[
  {fnName: 'eyes.it', fn: eyes.it},
  {fnName: 'it', fn: it},
  {fnName: 'eyes.test', fn: eyes.test},
  {fnName: 'test', fn: test},
].forEach(type => {
  type.fn(`should work for ${type.fnName}`, async () => {
    await global.page.goto('http://localhost:3000');
    expect(await global.page.$eval('div', el => el.innerText)).toEqual(
      'Hi there!',
    );
  });
});
