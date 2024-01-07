# rolod0x FAQ

- [Why is it called rolod0x?](#name)
- [Why does web3 need private address books?](#why)
  - [But what's wrong with existing name services?](#name-services)

## Why is it called rolod0x? <a name="name"></a>

<img src="./images/rotary-card-file.jpg" align="right" width="200"
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
