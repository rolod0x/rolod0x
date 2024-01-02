
<div align="center">
<img src="public/icon-128.png" alt="logo"/>
<h1>
  <!-- rolod<span style="color: #00e300">0x</span> -->
  <img src="./docs/rolod0x.svg" width="200" alt="rolod0x" />
</h1>
<h2> Your private web3 addressbook </h2>

[![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![](https://badges.aleen42.com/src/vitejs.svg)](https://vitejs.dev/)
<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/aspiers/rolod0xFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>
<br />
![Tests](https://github.com/aspiers/rolod0x/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/aspiers/rolod0x/actions/workflows/lint.yml/badge.svg)
![zip](https://github.com/aspiers/rolod0x/actions/workflows/build-zip.yml/badge.svg)

</div>

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Why is it called rolod0x?](#name)
- [Why does web3 need private address books?](#why)
  - [But what's wrong with existing name services?](#name-services)
- [Installation](#installation)
  - [Download](#download)
  - [Chrome](#chrome)
  - [Firefox](#firefox)
- [Support](#support)
- [Development](#development)
- [Star History](#star-history)
- [Thanks](#thanks)
- [License](#license)

## Intro <a name="intro"></a>

<img src="./docs/phone-unknown-number-calling.png" align="right" width="200"
     alt="Smart phone with unknown number calling" />

Would you buy a phone which didn't have an address book feature?  Of course
not - that would be ridiculous!  You'd never know who was calling you, and
making phone calls would be painful.

What about a phone which had an address book but required you to publish all
the entries so that the whole world could see them?  Of course not - that
would be a massive privacy violation!

**So why accept anything less when using web3 and blockchains?**

Well, you don't have to any longer!  rolod0x is a free cross-browser
extension providing **a totally private web3 address book which instantly
makes every web3 website more usable and all your addresses more
accessible.**

For example, take:
[this randomly-picked transaction on etherscan][random-tx]:

![etherscan transaction without rolod0x](docs/etherscan-example-before.png)

After labelling the From and To addresses in rolod0x, it now looks like this:

![etherscan transaction with rolod0x](docs/etherscan-example-after.png)

Not only that, but whenever these addresses appear on *any other website*,
they will now be labelled in this human-readable way!

[random-tx]: https://etherscan.io/tx/0x1e2a4312f7d48efd29ed5dbcca6cabae30214ea895ab54c9b789860cbe8d31dd

## Features <a name="features"></a>

- [Completely free and Open Source!](#license).
- Completely private local-only web3 address book.
- Automatically translates blockchain addresses to human-readable labels.
- Works on any website.
- Works on any EVM-based blockchain (and could easily support other
  chains in the future).
- Should work on Chrome, Chromium, Brave, or any other browser in the Chrome family.
- *May* work on Firefox - not yet tested, but planned (see https://github.com/aspiers/rolod0x/issues/19).

## Why is it called rolod0x? <a name="name"></a>

<img src="./docs/rotary-card-file.jpg" align="right" width="200"
     alt="Rotary business card file" />

It's a combination of three ideas:

- A [rolodex](https://en.wikipedia.org/wiki/Rolodex) is a rotating
  file device which used to be a common way to store business contact
  information before the digital era.

- The word
  "[dox](https://www.urbandictionary.com/define.php?term=dox)" or
  "[d0x](https://www.urbandictionary.com/define.php?term=d0x)" refers
  to (revealing of) personal information about people online.

- `0x` is [a prefix used to denote hexadecimal numbers][0x],
  and in particular it's used as a prefix for all Ethereum addresses.

[0x]: https://stackoverflow.com/questions/2670639/why-are-hexadecimal-numbers-prefixed-with-0x

## Why does web3 need private address books? <a name="why"></a>

Many websites in web3 use long undecipherable blockchain addresses like
`0x6B175474E89094C44Da98b954EedeAC495271d0F` to refer to wallet accounts or
smart contracts.  This often creates a miserable experience for users, since
they have to pick one of two unsatisfactory options:

1. attempt to memorise these addresses, which is totally impractical, and
   also dangerous since it leaves users vulnerable to phishing attacks, or

2. rely on some kind of public or centralised name service.

### But what's wrong with existing name services? <a name="name-services"></a>

Name services in web3 typically come in two forms:

1. Public name services, most notably [ENS](https://ens.domains/).
   ENS is an awesome service for labelling *public* addresses, but
   it does not work as a *private* address book since all ENS
   domains are public to the whole world.  Furthermore:

   - It costs gas every time you want to set up a domain.

   - In many cases, websites display raw addresses even when there
     is a corresponding ENS entry.

2. Per-site hosted address books

   For example, <https://etherscan.io> has a "Address Private Name Tags"
   feature so that when you create an account and log in, you can register
   private name tags for any addresses you want.  Then whenever the site
   would have previously displayed the raw addresses, it will instead
   display the private name tags you submitted.

   This feature is also available on similar block explorers such as
   <https://polygonscan.com>.  However, it has several drawbacks:

   - It requires you to set up a separate address book for each block
     explorer you use.

   - Even if you do that, it only works on the block explorer site(s), not
     on any other web3 dApps you might use.

   - These services typically place limits on the amount of data you can
     submit.  For example, Etherscan limits private name tags to 35
     characters, and doesn't let you register more than 5000 addresses.

   - It requires you to trust the centralized block explorer services with
     your private addresses.  This is in direct opposition to the web3
     values of trust minimization and decentralization!

## Installation <a name="installation"></a>

### Download <a name="download"></a>

Firstly download a `.zip` file from [a recent release][releases] or
a build of a PR or the `main` branch via the [zip workflow][].

[releases]: https://github.com/aspiers/rolod0x/releases
[zip workflow]: https://github.com/aspiers/rolod0x/actions/workflows/build-zip.yml

Then unpack the `.zip` file into a fresh folder anywhere on your machine,
remembering the location.

Then follow the relevant installation steps below for your browser:

### Installing in Chrome <a name="chrome"></a>

This should also work for other browsers in the Chrome family, such as
Chromium and Brave.

1. Open `chrome://extensions` in your browser.
2. Enable `Developer mode` at the top right.
3. Click `Load unpacked` at the top left.
4. Select the folder you just unpacked.

### Installing in Firefox: <a name="firefox"></a>

**N.B. Firefox support has not been tested yet!**  However it is
planned - see <https://github.com/aspiers/rolod0x/issues/19>.

1. Open `about:debugging#/runtime/this-firefox` in your browser.
2. Click `Load Temporary Add-on...`.
3. Select `manifest.json` from the folder you just unpacked.

**Please note that in Firefox when you add plugin in temporary mode, that
means it will disappear after closing the browser, so you have to do it
again on next launch.**

## Support <a name="support"></a>

Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Development and building from source <a name="development"></a>

For how to get started with development, see [the developer
guide](docs/dev-guide.md).

## Star History <a name="star-history"></a>

[![Star History Chart](https://api.star-history.com/svg?repos=aspiers/rolod0x&type=Date)](https://star-history.com/#aspiers/rolod0x&Date)

## Thanks <a name="thanks"></a>

Thanks to all contributors.  Some special mentions:

- [`@fregante`](https://github.com/fregante/) for all his great npm modules,
  several of which are used by rolod0x.

- [`@jonghakseo`](https://github.com/Jonghakseo/) for
  <https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite> which was
  a great starting point for a React-based MV3 extension.

- The awesome team at my startup [Toucan](https://toucan.earth) for being
  early beta testers and encouraging me to keep working on this project.

## Privacy policy <a name="privacy"></a>

Please see [the `privacy-policy.md` file](./privacy-policy.md).

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
