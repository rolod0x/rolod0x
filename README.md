<!-- markdownlint-disable MD013 MD033 MD041 -->
<div align="center">
<h1>
<img src="./docs/images/docs-header.png" alt="rolod0x: Your free private onchain address book" />
</h1>
</div>

<!-- auto-remove-section-for-jekyll -->
<p align="center">
<a href="https://github.com/rolod0x/rolod0x/releases/" alt="GitHub release"><img src="https://img.shields.io/github/release/rolod0x/rolod0x.svg" alt="Release badge" /></a>
<a href="https://github.com/rolod0x/rolod0x/commit/" alt="GitHub commits"><img src="https://img.shields.io/github/commits-since/rolod0x/rolod0x/latest.svg" alt="Commits badge" /></a>
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/rolod0x/rolod0x" />
<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React badge" /></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="Typescript badge" /></a>
<a href="https://vitejs.dev/"><img src="https://badges.aleen42.com/src/vitejs.svg" alt="Vite.js badge" /></a>
<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/rolod0x/rolod0xFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>
<br />
<img alt="Tests" src="https://github.com/rolod0x/rolod0x/actions/workflows/test.yml/badge.svg" />
<img alt="Lint" src="https://github.com/rolod0x/rolod0x/actions/workflows/lint.yml/badge.svg" />
<img alt="zip" src="https://github.com/rolod0x/rolod0x/actions/workflows/build-zip.yml/badge.svg" />
</p>
<!-- /auto-remove-section-for-jekyll -->

<!-- auto-replace-line-for-jekyll: {: .text-center} -->
[Overview](#overview)&nbsp;•
[Features](#features)&nbsp;•
[Video](https://youtu.be/AoWeASmnrPc)&nbsp;•
[Installation](./docs/install.md)&nbsp;•
[Usage](./docs/user-manual.md)&nbsp;•
[Telegram](https://t.me/rolod0x)&nbsp;•
[FAQ](./docs/FAQ.md)&nbsp;•
[Donations](#donations)&nbsp;•
[Support](./CONTRIBUTING.md)&nbsp;•
[Security](./SECURITY.md)&nbsp;•
[Privacy](./docs/privacy-policy.md)&nbsp;•
[Roadmap](#roadmap)&nbsp;•
[Development](./docs/dev-guide.md)&nbsp;•
[Star History](#star-history)&nbsp;•
[Thanks](#thanks)&nbsp;•
[License](#license)

<p align="center">
  <a style="margin: 10px 10px 0px 0px; text-decoration: none; text-align: center; color: white; background: #517BE8; display: inline-flex; align-items: center; justify-content: center; padding: 8px 20px; border-radius: 999px; font-size: 20px;" href="https://chromewebstore.google.com/detail/rolod0x/dgagbbklcgogbaamlbmaaemljjfnminp" target="_blank"  rel="noopener noreferrer" title="rolod0x in Chrome Web Store">
    <span style="display: inline-flex;">
      <img style="" loading="lazy" decoding="async" src="https://images.ctfassets.net/9sy2a0egs6zh/6jY0xZYtP18iUGOuL7qsEa/255fab1bec903c6a079c5b171afa9504/Chrome_Logo.svg" alt="rolod0x in Chrome Web Store" width="48">
    </span>
    <span style="padding: 0px 8px 0px 16px;">Download for Chrome</span>
  </a>
  <a style="margin-top: 10px; text-decoration: none; text-align: center; color: white; background: #517BE8; display: inline-flex; align-items: center; justify-content: center; padding: 8px 20px; border-radius: 999px; font-size: 20px;" href="https://addons.mozilla.org/en-GB/firefox/addon/rolod0x/" target="_blank"  rel="noopener noreferrer" title="rolod0x for Firefox">
    <span style="display: inline-flex;">
      <img style="" loading="lazy" decoding="async" src="./docs/images/Fx-Browser-icon-fullColor.svg" alt="rolod0x for Firefox" width="48">
    </span>
    <span style="padding: 0px 8px 0px 16px;">Download for Firefox</span>
  </a>
</p>

## Overview <a name="overview"></a>

<img src="./docs/images/phone-unknown-number-calling.png" align="right" width="200"
     alt="Smart phone with unknown number calling" />

Would you buy a phone which didn't have an address book feature?  Of course
not - that would be ridiculous!  You'd never know who was calling you, and
making phone calls would be painful.

What about a phone which had an address book but required you to publish all
the entries so that the whole world could see them?  Of course not - that
would be a massive privacy violation!

**So why accept anything less when using web3 and blockchains?**

Well, you don't have to any longer!  rolod0x is a free cross-browser
extension providing **a totally private onchain address book which instantly
makes every web3 website more usable and all your addresses more
accessible.**

For example, take:
[this randomly-picked transaction on etherscan][random-tx]:

![etherscan transaction without rolod0x](docs/images/etherscan-example-before.png)

After labelling the From and To addresses in rolod0x, it now looks like this:

![etherscan transaction with rolod0x](docs/images/etherscan-example-after.png)

Not only that, but whenever these addresses appear on _any other website_,
they will now be labelled in this human-readable way!

[random-tx]: https://etherscan.io/tx/0x1e2a4312f7d48efd29ed5dbcca6cabae30214ea895ab54c9b789860cbe8d31dd

## Features <a name="features"></a>

- [Completely free and Open Source!](#license)
- Completely private local-only web3 address book.
- Automatically translates blockchain addresses to human-readable labels.
- Add entries directly from within a web page, by right-clicking on an address.
- Instantly look up an address via a keyboard shortcut.
- Quick actions to copy addresses, search, or view on block explorers.
- Works on any website.
- Works on any EVM-based blockchain and Solana (and could easily support other
  chains in the future).
- Should work on Chrome, Chromium, Brave, or any other browser in the Chrome family.
- Should work on Firefox (see <https://github.com/rolod0x/rolod0x/issues/19>).
- [Command-line version](./docs/user-manual.md#cli) for translating addresses output on the terminal.
- Light and dark themes.
- Named using [a triple pun](./docs/FAQ.md#name).

## Demo video

<a href="https://youtu.be/AoWeASmnrPc" target="_blank" rel="noopener noreferrer" title="Demo video on YouTube"> <img src="docs/images/youtube-thumbnail.png" alt="Demo video on YouTube"/></a>

<!--
<div style="text-align: center;" align="center"> <iframe width="560" height="315" src="https://www.youtube.com/embed/AoWeASmnrPc?si=7en-7eQRgq3lLNwo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> </div>
-->

## Installation <a name="installation"></a>

Please see [the installation guide](./docs/install.md).

## Usage <a name="usage"></a>

Please see [the user manual](./docs/user-manual.md).

## FAQ <a name="faq"></a>

Please see [the Frequently Asked Questions page](./docs/FAQ.md).

## Donations <a name="donations"></a>

If you find this project helpful and would like to support its
development, you can make a donation in a number of ways:

- Through Gitcoin Grants Round 20: <https://explorer.gitcoin.co/#/round/42161/25/89>

- Through the Giveth platform: <https://giveth.io/project/rolod0x>

- Send **Bitcoin** to: `bc1quuspvrjepx63k5hpydwqkf6nmtt9eqm86y8w8a`

<!--
- Send **ETH** / tokens on any Ethereum network to: `rolod0x.eth`
  (N.B. that's a zero before the `x`, not an uppercase `O` -- the
  address should resolve to `0x06357397d8078C19195f4555db7A407b1b1f5FB3`)
-->

Your contribution will go directly towards enhancing the project,
covering development costs, and supporting ongoing maintenance.

We appreciate every donation, no matter the size.  It helps to ensure
the project's sustainability and motivates us to continue delivering
valuable updates and improvements.

Thank you for considering a donation to support our work!

## Support <a name="support"></a>

Please see [this document](./CONTRIBUTING.md).

## Security <a name="security"></a>

Please see [the `SECURITY.md` file](./SECURITY.md).

## Privacy policy <a name="privacy"></a>

Please see [`docs/privacy-policy.md` file](./docs/privacy-policy.md).

## Project roadmap <a name="roadmap"></a>

The roadmap and milestones can be seen in [this GitHub project][project].

[project]: https://github.com/users/aspiers/projects/2/views/5

## Development and building from source <a name="development"></a>

For information on how to get started with development, please see
the [developer guide][].

Any [pull request][using PRs] providing an enhancement or bugfix is
extremely welcome!

[developer guide]: docs/dev-guide.md
[using PRs]: https://help.github.com/articles/using-pull-requests/

## Star History <a name="star-history"></a>

<a href="https://star-history.com/#rolod0x/rolod0x&amp;type=Date"><img src="https://api.star-history.com/svg?repos=rolod0x/rolod0x&amp;type=Date" alt="GitHub star history chart" /></a>

## Thanks <a name="thanks"></a>

Thanks to all contributors.  Some special mentions:

- [`@fregante`](https://github.com/fregante/) for all his great npm modules,
  several of which are used by rolod0x.

- [`@jonghakseo`](https://github.com/Jonghakseo/) for
  <https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite> which was
  a great starting point for a React-based MV3 extension.

- Miles Essex for some fantastic design work which freed up my time to
  focus on technical work.  Check out his exciting project
  [Rails](https://rails.run) which generates dynamic, interactive maps
  visualising DeFi transactions!

- The awesome team at my startup [Toucan](https://toucan.earth) for
  being early beta testers and encouraging me to keep working on this
  project.  In particular, thanks to [Alex Haase](https://twitter.com/herrhaase)
  for brainstorming with me and coming up with the perfect name!

- [Dalton Maag](https://www.daltonmaag.com/) and
  [Canonical](https://canonical.com/) for [the Ubuntu
  font](https://design.ubuntu.com/font) whose `0x` gave me the
  inspiration for the logo.

- [ricmoo](https://www.ricmoo.com/) for the wonderful
  [ethers](https://ethers.org/) Javascript library.

## License <a name="license"></a>

Except where otherwise stated, this extension is licensed under the GNU
General Public License v3 or later.  See [`LICENSE.txt`](./LICENSE.txt) for
details.

This [Free Software license][free software] was chosen because its
[copyleft][] property ensures that rolod0x remains a public good whereby:

- the whole community benefits indefinitely from any contributions, and

- it's protected against commercial entities who could otherwise profit from
  the code without requiring any contributions back to the original project.

[free software]: https://www.gnu.org/philosophy/free-sw.html
[copyleft]: https://www.gnu.org/philosophy/free-sw.html#copyleft

### Why is there also a `LICENSE` file including the Expat ("MIT") license?

This extension is based on
<https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/>
[released][boilerplate-license] under [the permissive Expat (a.k.a. MIT)
license][expat], and formerly on
<https://github.com/fregante/browser-extension-template/> which is [released
under CC0][fregante-license].

Relicensing to GPL is allowed because the permissive Expat license
explicitly allows sublicensing as long as [the original copyright
notice](./LICENSE) is preserved.

[boilerplate-license]: https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/blob/6b61cd12eeb2fe478a6fd290b63fb6a9ef0f9ff2/LICENSE
[fregante-license]: https://github.com/fregante/browser-extension-template/#license
[expat]: https://www.gnu.org/licenses/license-list.html#Expat
