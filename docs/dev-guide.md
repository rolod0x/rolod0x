# rolod0x developer guide

Please also see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Building from source

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

Once you have built the extension, installation is the same as documented
in [the `README.md` file](../README.md).

## Linting

Run `pnpm lint` to run the codebase through `eslint` and `prettier` in
parallel, or `pnpm lint:eslint` and `pnpm lint:prettier` to do them
separately.

If you have [`fd`](https://github.com/sharkdp/fd) and
[`entr`](https://eradman.com/entrproject/) installed, then you can
also use `pnpm lint:watch` to continuously watch for file changes
and automatically trigger linting.

To automatically apply linting fixes, run `pnpm lint:eslint:fix`
and `pnpm lint:prettier:fix`, or just run `pnpm lint:fix` which
does both of the other two in parallel.
