# rolod0x security analysis

Since security is paramount in web3, every effort has been made to eliminate
any risk caused by using rolod0x.  Its design is inherently low risk since:

- It only operates on sites approved by the user.

- The core logic in [`parser.ts`](src/shared/parser.ts) and
  [`replacer.ts`](src/pages/content/replacer.ts) is really very simple.

- It only alters web pages by replacing addresses with labels supplied by
  the user.

- It doesn't interact directly with the blockchain.  Indeed, once
  installed, the extension doesn't rely on internet access *at all*;
  it just inspects and alters web pages locally in the browser.

- The data is stored locally within an isolated storage area in the
  browser reserved for the extension.

However, there are still some minor risks which need to be considered:

1. There is a theoretical but extremely unlikely possibility that the
   extension could label addresses incorrectly, confusing the user into
   performing unintentional actions.  This can be mitigated with automated
   and manual testing of the labelling code, and with independent auditing
   of the labelling logic.

2. The extension could be compromised, e.g. via a [JavaScript supply chain
   attack](https://prophaze.com/learning/what-are-javascript-supply-chain-attacks/)
   or other malware.  However this risk applies to all browser extensions,
   and can be mitigated much more easily by virtue of the fact that the code
   is Free and Open Source and can be easily audited and rebuilt from
   source.  If this makes you nervous, you should consider that web3 wallet
   extensions are in general a far more lucrative target for this type of attack.

3. The browser could be compromised via a bug, which could allow attackers
   access to the extension's local storage.  Again, this risk applies to
   all browser extensions, including web3 wallet extensions.

This is work in progress, and any suggestions for improvements are very welcome -
please see [`CONTRIBUTING.md`](CONTRIBUTING.md).
