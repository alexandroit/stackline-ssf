const { test } = require('node:test');
const assert = require('node:assert/strict');
const SSF = require('../');
test('Hungarian date separators and trailing period remain literal', () => {
  assert.equal(SSF.format('yyyy.mm.dd. hh:mm:ss', 45779.201898148145), '2025.05.02. 04:50:44');
  assert.equal(SSF.format('yyyy.mm.dd.', 45779), '2025.05.02.');
  assert.equal(SSF.format('dd.mm.yyyy', 45779), '02.05.2025');
  assert.equal(SSF.format('YYYY.MM.DD.', 45779), '2025.05.02.');
});
test('fractional seconds, number decimals and escaped periods keep their behavior', () => {
  assert.equal(SSF.format('hh:mm:ss.000', 0.500001), '12:00:00.086');
  assert.equal(SSF.format('0.00', 1.234), '1.23');
  assert.equal(SSF.format('yyyy\\.mm\\.dd\\.', 45779), '2025.05.02.');
  assert.equal(SSF.format('# ?/?', 1.5), '1 1/2');
});
test('fraction formatting works with no installed runtime dependency', () => {
  assert.deepEqual(require('../package.json').dependencies, {});
  assert.equal(SSF.format('# ??/??', 2.75), '2  3/4 ');
});
