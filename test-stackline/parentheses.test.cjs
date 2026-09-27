const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

function matcher(filename) {
  const context = { __regexp: null, module: { exports: {} } };
  const source = fs.readFileSync(filename, 'utf8');
  // Inspect the internal matcher without adding a public production export.
  vm.runInNewContext(source.replace('var closeparen = ', 'var closeparen = __regexp = '), context);
  assert.ok(context.__regexp);
  return context.__regexp;
}

test('parenthesis detection preserves original format and line-terminator semantics', () => {
  const original = /\).*[0#]/;
  const current = ['ssf.js', 'ssf.flow.js'].map((file) => matcher(path.join(__dirname, '..', file)));
  const alphabet = ['(', ')', '0', '#', 'x', '\r', '\n', '\u2028', '\u2029'];
  function compare(text, remaining) {
    const expected = original.test(text);
    for (const regex of current) assert.equal(regex.test(text), expected, JSON.stringify(text));
    if (remaining) for (const char of alphabet) compare(text + char, remaining - 1);
  }
  compare('', 5);
});

test('adversarial repeated closing parentheses finish within a bounded subprocess', () => {
  for (const file of ['ssf.js', 'ssf.flow.js']) {
    const filename = path.join(__dirname, '..', file);
    const script = `
      const fs = require('node:fs');
      const vm = require('node:vm');
      const assert = require('node:assert/strict');
      const context = { __regexp: null, module: { exports: {} } };
      const source = fs.readFileSync(process.argv[1], 'utf8');
      vm.runInNewContext(source.replace('var closeparen = ', 'var closeparen = __regexp = '), context);
      const attack = ')'.repeat(200000);
      assert.equal(context.__regexp.test(attack), false);
      assert.equal(context.__regexp.test(attack + '0'), true);
      assert.equal(context.__regexp.test(attack + '\\n0'), false);
    `;
    execFileSync(process.execPath, ['-e', script, filename], { timeout: 3000, stdio: 'pipe' });
  }
});
