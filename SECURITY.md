# Security analysis

Since security is paramount in web3, every effort has been made to eliminate
any risk caused by using rolod0x.

## Security design

rolod0x's design is inherently low risk since:

- It uses the minimum possible permissions, as documented [below](#perms).

- It only operates on sites approved by the user.

- The core logic in
  [`parser.ts`](https://github.com/rolod0x/rolod0x/blob/main/src/shared/parser.ts)
  and
  [`replacer.ts`](https://github.com/rolod0x/rolod0x/blob/main/src/pages/content/replacer.ts)
  is really very simple.

- It only alters web pages by replacing addresses with labels supplied by
  the user.

- It doesn't interact directly with the blockchain. Indeed, once
  installed, the extension doesn't rely on internet access _at all_;
  it just inspects and alters web pages locally in the browser.

- The data is stored locally within an isolated storage area in the
  browser reserved for the extension.

- Even though the address lookup feature writes to the clipboard, it only
  writes addresses which the user provided themself.

## Risk assessment

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
   extensions are in general a *far* more lucrative target for this type of attack.

3. The browser could be compromised via a bug, which could allow attackers
   access to the extension's local storage.  Again, this risk applies to
   all browser extensions, including web3 wallet extensions.

## Manifest permissions <a name="perms"></a>

The following chrome API permissions are requested by the extension manifest:

- `activeTab`: Required when the user presses the search hotkey, to
  execute the content script which displays the modal dialog allowing
  them to quickly and easily search their address book from the
  current tab.  This happens within an `<iframe>` inserted by a
  content script into a shadow root element inside the DOM.  The same
  mechanism also requires the `scripting` permission listed below.
  The code executing the script is here:

  <https://github.com/rolod0x/rolod0x/blob/372582fdfe534ea51907be362e782008b75c559c/src/pages/background/index.ts#L49-L52>

- `clipboardRead`: Required to paste the contents of the clipboard
  into the address book.  The call can be seen here:

  <https://github.com/rolod0x/rolod0x/blob/372582fdfe534ea51907be362e782008b75c559c/src/pages/lookup/ui/ActionBar.tsx#L81>

- `clipboardWrite`: Required to copy the selected address to the
  clipboard, when the user completes their search of the address book.
  This happens within an `<iframe>` inserted by a content script into
  a shadow root element inside the DOM.  The call can be seen here:

  <https://github.com/rolod0x/rolod0x/blob/372582fdfe534ea51907be362e782008b75c559c/src/pages/lookup/ui/ActionBar.tsx#L81>

- `contextMenus`: Required in order to items to two context menus:

  1. Add an item "Enable rolod0x on this domain" to the context menu
     when right-clicking on the extension icon.  This is the mechanism
     for enabling and disabling access per website.  It is provided by
     the Open Source npm module
     <https://github.com/fregante/webext-permission-toggle>, and
     activated here:

     <https://github.com/rolod0x/rolod0x/blob/372582fdfe534ea51907be362e782008b75c559c/src/pages/background/index.ts#L16>

  2. Add an item "rolod0x: add entry to address book" to the context
     menu when right-clicking within a web page.  This is activated
     here:

     <https://github.com/rolod0x/rolod0x/blob/372582fdfe534ea51907be362e782008b75c559c/src/pages/background/contextMenu.ts#L49-L52>

- `scripting`: Required when the user presses the search hotkey, to
  execute the content script which displays the modal dialog for
  searching the address book.  This happens within an `<iframe>`
  inserted by a content script into a shadow root element inside the
  DOM.  The same mechanism also requires the `activeTab` permission
  listed above.  The code executing the script is here:

  <https://github.com/rolod0x/rolod0x/blob/372582fdfe534ea51907be362e782008b75c559c/src/pages/background/index.ts#L49-L52>

- `storage`: Required to store the user's address book and settings
  locally.  The storage-handling code can be found
  here:

  <https://github.com/rolod0x/rolod0x/blob/372582fdfe534ea51907be362e782008b75c559c/src/shared/options-storage.ts#L19-L24>

  and it depends on the npm module <https://github.com/fregante/webext-options-sync/>.

- Host permissions: These have been required because in web3 there are
  certain highly popular and well respected sites which are frequented
  by the majority of users, and it provides a smoother onboarding
  experience if users don't have to authorise the extension for each
  of these manually.

  In particular, the usage of block explorers like
  <https://etherscan.io> and its family of clones for the various
  other EVM chains are used extremely commonly.  Every web3 wallet and
  pretty much every onchain app links to block explorers as part of
  its regular UX.

  With the explosive growth of many layer 2 and layer 3 chains over
  the last year (e.g. see <https://l2beat.com/>), users are already
  being asked to jump through various setup steps for various pieces
  of software when using a new chain for the first time, so it's
  helpful for rolod0x to avoid that, given that it is such a low risk
  extension (for reasons explained above).

## Feedback

This is work in progress, and any suggestions for improvements are very welcome -
please see [`CONTRIBUTING.md`](CONTRIBUTING.md).
