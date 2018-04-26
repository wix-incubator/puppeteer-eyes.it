const path = require('path');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
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
    res.on('close', () => fullfill());
    await p;
    expect(_data).toContain('eyes comparison succeed');
  });
});
