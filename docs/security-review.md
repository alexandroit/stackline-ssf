# SSF CodeQL review — 2026-09-27

The JavaScript CodeQL alerts [1](https://github.com/alexandroit/stackline-ssf/security/code-scanning/1) and [2](https://github.com/alexandroit/stackline-ssf/security/code-scanning/2) identify the internal `closeparen` matcher, previously `/\).*[0#]/`. A string consisting of many closing parentheses without a following `0` or `#` causes repeated suffix scans. The matcher now stops at another closing parenthesis or a JavaScript line terminator. If another closing parenthesis occurs before the eventual digit marker, a match can start at that later parenthesis, preserving the original boolean result. Each interval is scanned a bounded number of times.

The test suite compares the new matcher against the original over short combinations of format characters and all JavaScript line terminators, and evaluates a 200,000-character adversarial input in a separate process with a deadline. Both the runtime and Flow source are covered. The full published formatting corpus remains in the suite.

This is a confirmed expensive internal regex, with a focused hardening fix. A public exploit path has not been established: the guarded branch requires a parenthesis type, while the visible public formatting calls select numeric or question-mark types. No assertion of a publicly exploitable denial of service is made.

The incomplete-sanitization alerts in `test/comma.js` and `test/exp.js` refer to removal of a fixture delimiter before expected-value comparison. They do not implement HTML escaping or an input validation boundary. Their first-occurrence behavior is retained to preserve the upstream fixture interpretation. The shared registry diagnostic script alert is handled separately from SSF runtime code.
