# Developer guide

- [How to contribute](#workflows)
- [Building from source](#build)
- [Debugging with React devtools](#devtools)
- [Linting](#lint)
- [Unit tests](#test)
- [Website](#website)

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

1. Clone the repository from GitHub, e.g.

        git clone git@github.com:rolod0x/rolod0x.git

2. Install pnpm globally: `npm install -g pnpm` (check your node version >=
   16.6, recommended >= 18)

3. Run `pnpm install`

Then you can build the extension as follows:

|             | Chrome       | Firefox              | both               |
|-------------|--------------|----------------------|--------------------|
| development | `pnpm dev`   | `pnpm dev:firefox`   | `pnpm dev:all`     |
| production  | `pnpm build` | `pnpm build:firefox` | `pnpm firefox:all` |

The development build commands all continually watch for changes to
files and automatically trigger rebuilds when changes are spotted.

In contrast, the production build commands are one-shot and only build
once before exiting.

The `*:all` commands run builds for both in parallel for greater
speed.

### Installation

Once you have built the extension, installation is the same as
documented in the installation guide for [Chrome](./install.md#chrome)
or [Firefox](./install.md#firefox), except you have to select the
folder `dist/chrome` or `dist/firefox` respectively.

For Firefox, you can launch a fresh install of the extension in
a clean profile via:

    pnpm test:firefox

This is just a wrapper around the `run` subcommand of [the `web-ext`
utility](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/),
so you can also specify additional `web-ext` parameters as desired,
such as `-u https://etherscan.io/address/0x...` to start on a
particular block explorer page.

Please note that this installation is temporary, so any settings will
be lost when that Firefox instance is terminated.

## Debugging with React Developer Tools <a name="devtools"></a>

You can debug the extension with React Developer Tools as follows:

- Change `content_security_policy` in `manifest.js` to include
  `script-src http://localhost:8097 'self'`, and restart `pnpm dev`.

- Uncomment the relevant occurrence(s) of

      <script src="http://localhost:8097"></script>

  as needed.

- Run `pnpm devtools`.

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

## Website <a name="website"></a>

First ensure that you have Ruby 3.3.x or similar installed, since the website
is generated via Jekyll which runs on Ruby.

All files required for the website need to live under the `website/`
subdirectory.  Some are already placed there by git, but others
(mostly Markdown files and images) need to be copied in via:

    pnpm website:prepare

Then to generate the website and preview it locally, run:

    cd website

    # If this fails due to lack of write access for installing
    # gems, try adding the --deployment option:
    bundle install

    bundle exec jekyll serve --open

If you modify source files, you'll need to rerun `pnpm
website:prepare` to copy them in.  If you modify the Jekyll config in
`_config.yml` or `Gemfile` then you'll need to restart the server.
