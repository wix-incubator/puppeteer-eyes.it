const {spawnSync} = require('child_process');
const path = require('path');
const eyes = require('../index');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
describe('Eyes with default version', () => {
  [
    {fnName: 'eyes.it', fn: eyes.it},
    {fnName: 'it', fn: it},
    {fnName: 'eyes.test', fn: eyes.test},
    {fnName: 'test', fn: test},
  ].forEach(type => {
    type.fn(`should work for ${type.fnName}`, async () => {
      const divText = 'Hello World!';
      await global.page.setContent(`<div>${divText}</div>`);
      expect(await global.page.$eval('div', el => el.innerText)).toEqual(
        divText,
      );
    });
  });
});

describe('Eyes with new baseline, according to versions', () => {
  eyes.it(
    `should work for eyes.it, version 1.0.0`,
    async () => {
      const divText = 'Hi there!';
      await global.page.setContent(`<div>${divText}</div>`);
      expect(await global.page.$eval('div', el => el.innerText)).toEqual(
        divText,
      );
    },
    {version: '1.0.0'},
  );
  eyes.it(
    `should work for eyes.it, version 1.0.0`,
    async () => {
      const divText = 'Ho there!';
      await global.page.setContent(`<div>${divText}</div>`);
      expect(await global.page.$eval('div', el => el.innerText)).toEqual(
        divText,
      );
    },
    {version: '1.0.1'},
  );
});

describe('Log', () => {
  it('should log after eyes success', () => {
    // eslint-disable-next-line no-control-regex
    const strColorStripReg = /\x1B[[(?);]{0,2}(;?\d)*./g;
    const res = spawnSync(
      'node',
      [
        path.join(__dirname, '..', 'node_modules', 'jest', 'bin', 'jest.js'),
        path.join(__dirname, 'fixtures', 'test.customSpec.js'),
        `--config=${path.join(__dirname, 'fixtures', 'conf.json')}`,
      ],
      {env: process.env},
    );

    expect(res.stdout.toString().replace(strColorStripReg, '')).toContain(
      'Test Suites: 1 passed, 1 total',
    );
  });
});
