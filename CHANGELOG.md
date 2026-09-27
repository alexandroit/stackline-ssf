# Changelog

## 1.0.0

- Treat a dot in a date format as a literal separator unless followed by fractional-second zeros (upstream issues #96 and #97). Numeric decimals and ss.000 keep their original behavior.
- Remove the unused frac runtime dependency: the exact released source already contains the fraction algorithm and does not import frac or any runtime package.
- Keep ssf.js and ssf.flow.js aligned, retain the upstream formatting corpus, and use node:test without the obsolete development dependency tree.

Initial scoped release based on upstream ssf@0.11.2. See UPSTREAM.json for exact source identity.
