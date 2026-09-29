# @stackline/ssf

> Format data using ECMA-376 spreadsheet Format Codes.

[![npm version](https://img.shields.io/npm/v/@stackline/ssf.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/ssf)
[![license](https://img.shields.io/npm/l/@stackline/ssf.svg?style=flat-square)](https://github.com/alexandroit/stackline-ssf)
[![GitHub repository](https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-ssf)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/ssf/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/ssf/)** | **[npm](https://www.npmjs.com/package/@stackline/ssf)** | **[Issues](https://github.com/alexandroit/stackline-ssf/issues)** | **[Repository](https://github.com/alexandroit/stackline-ssf)**

**Current package version:** `1.0.2`

---

## Why this package?

Independently maintained Apache-2.0 fork of `ssf@0.11.2`. Original implementation, attribution and license are retained; this is not an official SheetJS release. The precise published source, git commit and SHA-512 integrity are recorded in [UPSTREAM.json](https://github.com/alexandroit/stackline-ssf/blob/main/UPSTREAM.json).

```sh
npm install @stackline/ssf
```

```js
const library = require("@stackline/ssf");
```

### Changes in 1.0.0

- Treat a dot in a date format as a literal separator unless followed by fractional-second zeros (upstream issues #96 and #97). Numeric decimals and ss.000 keep their original behavior.
- Remove the unused frac runtime dependency: the exact released source already contains the fraction algorithm and does not import frac or any runtime package.
- Keep ssf.js and ssf.flow.js aligned, retain the upstream formatting corpus, and use node:test without the obsolete development dependency tree.

ssf (SpreadSheet Format) is a pure JS library to format data using ECMA-376
spreadsheet format codes (used in popular spreadsheet software packages).

This is the community version.  We also offer a pro version with additional
features like international support as well as dedicated support.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/ssf@1.0.2` |
| Supported Node.js | `>=0.8` |
| Module entry | `./ssf` (CommonJS) |
| Runtime dependencies | 0 direct dependencies |
| Types | `types` |

## Installation

```bash
npm install @stackline/ssf
```

With [npm](https://www.npmjs.com/package/@stackline/ssf):

```bash
$ npm install @stackline/ssf
```

In the browser:

```html
<script src="ssf.js"></script>
```

The browser exposes a variable `SSF`

When installed globally, npm installs a script `ssf` that renders the format
string with the given arguments.  Running the script with `-h` displays help.

The script will manipulate `module.exports` if available .  This is not always
desirable.  To prevent the behavior, define `DO_NOT_EXPORT_SSF`.

## Usage

```js
const SSF = require('@stackline/ssf');
console.log(SSF.format('0.00', 12.3)); // 12.30
```

`SSF.format(fmt, val, opts)` formats `val` using the format `fmt`.

If `fmt` is a string, it will be parsed and evaluated.  If `fmt` is a `number`,
the actual format will be the corresponding entry in the internal format table.
For a raw numeric format like `000`, the value should be passed as a string.

Date arguments are interpreted in the local time of the JS client.

The options argument may contain the following keys:

| Option Name | Default | Description                                          |
| :---------- | :-----: | :--------------------------------------------------- |
| `date1904`  | false   | Use 1904 date system if true, 1900 system if false   |

### Manipulating the Internal Format Table

Binary spreadsheet formats store cell formats in a table and reference by index.
This library uses a global table:

`SSF._table` is the underlying object, mapping numeric keys to format strings.

`SSF.load(fmt:string, idx:?number):number` assigns the format to the specified
index and returns the index.  If the index is not specified, SSF will search the
space for an available format slot pick an unused slot.  For compatibility with
the XLS and XLSB file formats, custom indices should be in the valid ranges
`5-8`, `23-26`, `41-44`, `63-66`, `164-382` (see `[MS-XLSB] 2.4.655 BrtFmt`)

`SSF.get_table()` gets the internal format table (number to format mapping).

`SSF.load_table(table)` sets the internal format table.

### Other Utilities

`SSF.parse_date_code(val:number, opts:?any)` parses `val`, returning an object:

```typescript
type SSFDate = {
  D:number; /* number of whole days since relevant epoch, 0 <= D */
  y:number; /* integral year portion, epoch_year <= y */
  m:number; /* integral month portion, 1 <= m <= 12 */
  d:number; /* integral day portion, subject to gregorian YMD constraints */
  q:number; /* integral day of week (0=Sunday .. 6=Saturday) 0 <= q <= 6 */

  T:number; /* number of seconds since midnight, 0 <= T < 86400 */
  H:number; /* integral number of hours since midnight, 0 <= H < 24 */
  M:number; /* integral number of minutes since the last hour, 0 <= M < 60 */
  S:number; /* integral number of seconds since the last minute, 0 <= S < 60 */
  u:number; /* sub-second part of time, 0 <= u < 1 */
}
```

`SSF.is_date(fmt:string):boolean` returns `true` if `fmt` encodes a date format.

### Examples

- [Basic Demo](http://oss.sheetjs.com/ssf/)
- [Custom Formats Builder](https://customformats.com)

## Features

### Related Packages

[`ssf-cli`](https://www.npmjs.com/package/ssf-cli) is a simple NodeJS command
line tool for formatting numbers.

## Security

The parenthesis matcher is bounded to avoid quadratic backtracking on repeated closing parentheses. Date-format dot handling and numeric decimal behavior retain their documented distinctions.

## API Surface

### References

- `ECMA-376`: Office Open XML File Formats
 - `MS-XLS`: Excel Binary File Format (.xls) Structure Specification
 - `MS-XLSB`: Excel (.xlsb) Binary File Format

## Local Development

Clone the [repository](https://github.com/alexandroit/stackline-ssf) and run the following commands from its root:

```bash
npm ci
npm run build
npm test
npm run lint
```

The retained upstream development notes below include historical tooling; the commands above are the maintained package checks.

### Development and verification

Use Node.js 18 or newer for development (verified locally with Node 24). Run `npm ci --ignore-scripts`, `npm run build`, `npm run lint`, `npm test`, and `npm run test:package`.

`lint` is a JavaScript syntax check, not a claim of a full style/security analysis. All packages have no runtime npm dependencies. `npm audit` reports registry advisories only; absence of findings is not proof that all format parsing is safe.

1,438 passing tests, including the original formatting corpus; one existing upstream Thai-format test remains skipped.

Sources reviewed on 2026-09-27:

- https://github.com/SheetJS/ssf/issues/96
- https://github.com/SheetJS/ssf/issues/97
- https://git.sheetjs.com/sheetjs/sheetjs/issues

Publication is performed by the repository GitHub workflow; do not publish from a local checkout. This fork does not modify or publish `@stackline/xlsx`.

## Consumer Smoke Test

`npm run test:package` packs the library and exercises an isolated consumer using the repository fixture.

## Release Checklist

1. Update the package version, lockfile, generated version fields, and changelog together.
2. Run the development checks above and audit both `npm audit` and `npm audit --omit=dev`.
3. Use the [GitHub publish workflow](https://github.com/alexandroit/stackline-ssf/actions/workflows/publish.yml) with its `Prod` environment to publish the exact CI tarball.
4. Verify public npm bytes, package identity, provenance, and the immutable GitHub release evidence.

## License

[Apache-2.0](https://github.com/alexandroit/stackline-ssf/blob/main/LICENSE). Original copyright notices and upstream attribution are retained.

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 license are reserved by the Original Author.

See [NOTICE](https://github.com/alexandroit/stackline-ssf/blob/main/NOTICE) for retained attribution.

## Credits and original authors

- Original project: [ssf](https://github.com/SheetJS/ssf).
- sheetjs.
- Copyright (C) 2013-present   SheetJS LLC.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.
