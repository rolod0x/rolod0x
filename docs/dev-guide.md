# rolod0x developer guide

- [How to contribute](#workflows)
- [Building from source](#build)
- [Linting](#lint)
- [Unit tests](#test)

## How to contribute <a name="workflows"></a>

Please first see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

Any [pull request][using PRs] providing an enhancement or bugfix is
extremely welcome!

My spare time to work on this project is limited, so please follow
these [guidelines on contributing][7 principles] so that you can help
me to help you ;-)

Thanks in advance!

[using PRs]: https://help.github.com/articles/using-pull-requests/
[7 principles]: http://blog.adamspiers.org/2012/11/10/7-principles-for-contributing-patches-to-software-projects/

## Building from source <a name="build"></a>

1. Install pnpm globally: `npm install -g pnpm` (check your node version >=
   16.6, recommended >= 18)

2. Run `pnpm install`

Then you can build the extension as follows.

### For Chrome: <a name="chrome"></a>

Run:

- Dev: `pnpm dev` or `npm run dev`
- Prod: `pnpm build` or `npm run build`

### For Firefox: <a name="firefox"></a>

1. Run:
   - Dev: `pnpm dev:firefox` or `npm run dev:firefox`
   - Prod: `pnpm build:firefox` or `npm run build:firefox`

### Installation

Once you have built the extension, installation is the same as
documented in the installation guide for [Chrome](./install.md#chrome)
or [Firefox](./install.md#firefox), except you have to select the
folder `dist/chrome` or `dist/firefox` respectively.

## Linting <a name="lint"></a>

Run `pnpm lint` to run the codebase through `eslint` and `prettier` in
parallel, or `pnpm lint:eslint` and `pnpm lint:prettier` to do them
separately.

However, rather than manually running these, it is highly recommended
to ensure that you have `[fd][]` and `[entr][]` installed, and then
use `pnpm lint:watch` to continuously watch for file changes and
automatically trigger linting.

[fd]: https://github.com/sharkdp/fd
[entr]: https://eradman.com/entrproject/

To automatically apply linting fixes, run `pnpm lint:eslint:fix`
and `pnpm lint:prettier:fix`, or just run `pnpm lint:fix` which
does both of the other two in parallel.

## Unit tests <a name="test"></a>

You can run the test suite once via `pnpm test`; however as with linting
it is recommended instead to run `pnpm test:watch` which will automatically
re-run all tests whenever relevant files change.

If you are adding new functionality or bug fixes, please ensure that you
add tests to cover those cases.
