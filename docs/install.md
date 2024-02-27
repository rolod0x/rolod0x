# Installation of rolod0x

- [Downloads](#downloads)
- [Installation in Chrome and similar](#chrome)
- [Upgrading a Chrome installation](#chrome-upgrade)
- [Installation in Firefox](#firefox)
- [Installation from source](#source)
- [Installation of the command-line utility](#cli)

## Downloads <a name="downloads"></a>

In the (hopefully near) future, rolod0x will be available from the Chrome
Web Store (for which you can track progress in [#14][]) and Firefox Add-ons
directory (see [#19][] and [#15][]).  This will greatly simplify installation.

[#14]: https://github.com/aspiers/rolod0x/issues/14
[#15]: https://github.com/aspiers/rolod0x/issues/15
[#19]: https://github.com/aspiers/rolod0x/issues/19

However for now, you can download a `.zip` file from one of two places:

1. Go to [the releases page][releases], pick a recent release, and then look
   for an asset named something like `rolod0x-v0.1.0.zip` at the Assets
   section at the bottom of the release page.

2. Go to the [zip workflow][] page, and pick a build of a PR or branch such
   as `main`.  In this case you will need to download an artifact called
   `rolod0x.zip`.

[releases]: https://github.com/aspiers/rolod0x/releases
[zip workflow]: https://github.com/aspiers/rolod0x/actions/workflows/build-zip.yml

Then unpack the `.zip` file into a fresh folder anywhere on your machine,
remembering the location.

Then follow the relevant installation steps below for your browser:

## Installation in Chrome <a name="chrome"></a>

This should also work for other browsers in the Chrome family, such as
Chromium and Brave.

1. Open <chrome://extensions> in your browser.
2. Enable `Developer mode` at the top right.
3. Click `Load unpacked` at the top left.
4. Select the folder you just unpacked.

## Upgrading an existing installation in Chrome <a name="chrome-upgrade"></a>

Obviously you can uninstall the existing installation and do a fresh
install, but that may lose all your config.  So the following is probably
better:

1. Download and unpack the new version in exactly the same place.
2. Open <chrome://extensions> in your browser.
3. Click the reload icon near the bottom right of the rolod0x extension
   card.

## Installation in Firefox <a name="firefox"></a>

**N.B. Firefox support has not been tested yet!**  However it is
planned - see <https://github.com/aspiers/rolod0x/issues/19>.

1. Open `about:debugging#/runtime/this-firefox` in your browser.
2. Click `Load Temporary Add-on...`.
3. Select `manifest.json` from the folder you just unpacked.

**Please note that in Firefox when you add plugin in temporary mode, that
means it will disappear after closing the browser, so you have to do it
again on next launch.**

## Installation from source <a name="source"></a>

See the [developer guide][].

Any [pull request][using PRs] providing an enhancement or bugfix is
extremely welcome!

[developer guide]: docs/dev-guide.md

## Installation of the command-line utility <a name="cli"></a>

For now this requires building from source as per above.  Once you
have done `pnpm install` then in theory it should be enough to run:

    pnpm link --global

and this should install a `rolod0x` executable within a
pnpm-controlled directory on your `$PATH`.  However, it seems that
`pnpm` still has issues installing scripts in some cases, so if you
run into problems with this, please follow the guidelines in
[`CONTRIBUTING.md`](../CONTRIBUTING.md).
