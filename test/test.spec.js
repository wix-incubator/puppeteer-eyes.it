const eyes = require('../index');

describe('Eyes with default version', () => {
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
});

describe('Eyes with new baseline, according to versions', () => {
  eyes.it(
    `should work for eyes.itv, version 1.0.0`,
    async () => {
      await global.page.goto('http://localhost:3000');
      expect(await global.page.$eval('div', el => el.innerText)).toEqual(
        'Hi there!',
      );
    },
    {version: '1.0.0'},
  );
  eyes.it(
    `should work for eyes.itv, version 1.0.1`,
    async () => {
      await global.page.goto('http://localhost:3000/index2.html');
      expect(await global.page.$eval('div', el => el.innerText)).toEqual(
        'Ho there!',
      );
    },
    {version: '1.0.1'},
  );
});
