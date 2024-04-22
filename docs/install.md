# Installation

<a style="margin-top: 10px; text-decoration: none; text-align: center; color: white; background: #517BE8; display: inline-flex; align-items: center; justify-content: center; padding: 8px 20px; border-radius: 999px; font-size: 20px;" href="https://chromewebstore.google.com/detail/rolod0x/dgagbbklcgogbaamlbmaaemljjfnminp" target="_blank"  rel="noopener noreferrer" title="rolod0x in Chrome Web Store">
  <span style="display: inline-flex;">
    <img style="" loading="lazy" decoding="async" src="https://images.ctfassets.net/9sy2a0egs6zh/6jY0xZYtP18iUGOuL7qsEa/255fab1bec903c6a079c5b171afa9504/Chrome_Logo.svg" alt="rolod0x in Chrome Web Store" width="48">
  </span>
  <span style="padding: 0px 8px 0px 16px;">Download from Chrome Web Store</span>
</a>

This should work for Chrome and other browsers in the Chrome family,
such as Chromium and Brave.

However, if you use Firefox, or just want to install directly from
GitHub, read on!

## Table of contents

- [Downloads from GitHub](#downloads)
- [Installation in Chrome and similar](#chrome)
- [Upgrading a Chrome installation](#chrome-upgrade)
- [Installation in Firefox](#firefox)
- [Installation from source](#source)
- [Installation of the command-line utility](#cli)

## Downloads from GitHub <a name="downloads"></a>

You can download a `.zip` file from one of three places:

1. Go to [the releases page][releases], pick a recent release, and
   then look for an asset named something like
   `rolod0x-v1.4.0-chrome.zip` at the Assets section at the bottom of
   the release page.  However currently `.zip` files for Firefox are
   not included in releases since they are [not yet of release
   quality](https://github.com/rolod0x/rolod0x/issues/19).

2. View [the list of recent builds of the `main` branch][main].  Click
   on the latest, or another recent one, then scroll down to the
   bottom of the page and download the relevant artifact `.zip` file,
   which will be called `rolodox-main-firefox` or similar.

3. Go to the [zip workflow][] page, and pick any recent build.  This
   is especially useful if you want to test a particular pull request
   which is still in development (e.g. for a bug fix or new feature).
   Then download the artifact in the same way as in step 2.

[releases]: https://github.com/rolod0x/rolod0x/releases
[main]: https://github.com/rolod0x/rolod0x/actions/workflows/build-zip.yml?query=branch%3Amain
[zip workflow]: https://github.com/rolod0x/rolod0x/actions/workflows/build-zip.yml

Then unpack the `.zip` file into a fresh folder anywhere on your machine,
remembering the location.

Then follow the relevant installation steps below for your browser:

## Installation from GitHub in Chrome <a name="chrome"></a>

This should also work for other browsers in the Chrome family, such as
Chromium and Brave.

1. Open <chrome://extensions> in your browser.
2. Enable `Developer mode` at the top right.
3. Click `Load unpacked` at the top left.
4. Select the folder you just unpacked.

## Upgrading an existing GitHub installation in Chrome <a name="chrome-upgrade"></a>

Obviously you can uninstall the existing installation and do a fresh
install, but that may lose all your config.  So the following is probably
better:

1. Download and unpack the new version in exactly the same place.
2. Open <chrome://extensions> in your browser.
3. Click the reload icon near the bottom right of the rolod0x extension
   card.

## Installation from GitHub in Firefox <a name="firefox"></a>

**N.B. Firefox support has not been heavily tested yet!**  However it
is [in progress](https://github.com/rolod0x/rolod0x/issues/19).  Once
all the issues have been ironed out, we aim to [publish it in the
Firefox Add-ons directory](https://github.com/rolod0x/rolod0x/issues/15)
to simplify installation.

In the mean time you are very welcome to try it out and
[report bugs](../CONTRIBUTING.md).  After following the
download instructions above, take the following steps:

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

[developer guide]: ./dev-guide.md
[using PRs]: https://docs.github.com/en/pull-requests

## Installation of the command-line utility <a name="cli"></a>

For now this requires building from source as per above.  Once you
have done `pnpm install` then in theory it should be enough to run:

    pnpm link --global

and this should install a `rolod0x` executable within a
pnpm-controlled directory on your `$PATH`.  However, it seems that
`pnpm` still has issues installing scripts in some cases, so if you
run into problems with this, please follow the guidelines in
[`CONTRIBUTING.md`](../CONTRIBUTING.md).
