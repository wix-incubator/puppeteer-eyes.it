const eyes = require('../index');
const path = require('path');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
describe('Eyes with default version', () => {
  [
    {fnName: 'eyes.it', fn: eyes.it},
    {fnName: 'it', fn: it},
    {fnName: 'eyes.test', fn: eyes.test},
    {fnName: 'test', fn: test},
  ].forEach(type => {
    type.fn(`should work for ${type.fnName}`, async () => {
      await global.page.setContent('<div>Hi there!</div>');
      expect(await global.page.$eval('div', el => el.innerText)).toEqual(
        'Hi there!',
      );
    });
  });
});

describe('Eyes with new baseline, according to versions', () => {
  eyes.it(
    `should work for eyes.it, version 1.0.0`,
    async () => {
      await global.page.setContent('<div>Hi there!</div>');
      expect(await global.page.$eval('div', el => el.innerText)).toEqual(
        'Hi there!',
      );
    },
    {version: '1.0.0'},
  );
  eyes.it(
    `should work for eyes.it, version 1.0.0`,
    async () => {
      await global.page.setContent('<div>Ho there!</div>');
      expect(await global.page.$eval('div', el => el.innerText)).toEqual(
        'Ho there!',
      );
    },
    {version: '1.0.1'},
  );
});

describe('Log', () => {
  it('should log after eyes success', async () => {
    const {spawn} = require('child_process');
    let _data;
    let fullfill;
    const p = new Promise(resolve => (fullfill = resolve));

    const res = spawn('node', [
      path.join(__dirname, '..', 'node_modules', 'jest', 'bin', 'jest.js'),
      path.join(__dirname, 'fixtures', 'test.customSpec.js'),
      `--config=${path.join(__dirname, 'fixtures', 'conf.json')}`,
      path.join(__dirname, '..', 'index.js'),
    ]);
    res.stdout.on('data', data => {
      _data += data.toString('utf8');
    });
    res.on('close', fullfill);
    await p;
    expect(_data).toContain('eyes comparison succeed');
  });
});
