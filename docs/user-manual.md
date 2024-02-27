# rolod0x user manual

- [Usage in Chrome and similar](#chrome)
- [Usage in other browsers](#other)
- [Usage on the command line](#cli)

## Usage in Chrome and similar <a name="chrome"></a>

The following instructions are for Chrome and other browsers in the
Chrome family, such as Chromium and Brave.

- Once the extension is installed, it is recommended to pin it to the
  toolbar.  This can done either from <chrome://extensions>, or by clicking
  the jigsaw icon, finding the extension in the list, and then clicking the
  pin icon.

- On install, the extension's options page will automatically open,
  but you can re-open it later in the normal way, e.g. by clicking on
  the extension icon if it's pinned, or from <chrome://extensions>, or
  again via the jigsaw icon and then clicking the icon with the three
  vertical dots to the right of the extension.

- From the options page, add some addresses to your address book as
  directed by the help text.

- Click the `Save` button.

- Visit a web page where those addresses are displayed.

- You will now need to make sure that rolod0x is enabled for that website.
  If you have pinned the extension to the toolbar, you can right-click the
  extension icon and make sure that `Enable rolod0x on this domain` is
  selected.  Otherwise, you can reach the same context menu by clicking the
  three dots icon mentioned above.

- At this point, you should see that the addresses on the web page have been
  replaced with the labels you provided in the extension options.  If not,
  try simply reloading the web page.

## Usage in other browsers <a name="other"></a>

**N.B. Firefox support has not been tested yet!**  However it is
planned - see <https://github.com/aspiers/rolod0x/issues/19>.

Other browsers such as Firefox will have similar usage, but these
instructions will need to be augmented accordingly when they are
officially supported.

## Usage on the command line <a name="cli"></a>

If [installation](./install.md#cli) was successful then you should be
able to run the `rolod0x` command.  If not, then try to `cd` to the
source directory and run:

    pnpm --silent run rolod0x

The CLI utility takes an address book text file as a parameter, and
then reads input from `STDIN` and filters it through rolod0x's
replacement engine, so that `STDOUT` will contain the same text with
any recognised addresses substituted for a labelled version.

The substitution format can be controlled similarly as in the browser
extension.
