import { Fragment } from 'react';
import Typography from '@mui/material/Typography';
// import { List, ListItem, ListItemText } from '@mui/material';

import './Donate.css';

export default function Donate() {
  return (
    <Fragment>
      <Typography variant="h4" component="h2">
        Donate
      </Typography>
      <Typography paragraph>
        If you find this project helpful and would like to support its development, you can make a
        donation using the following cryptocurrency addresses:
      </Typography>
      <ul>
        <li>
          Send <strong>Bitcoin</strong> to: <code>bc1quuspvrjepx63k5hpydwqkf6nmtt9eqm86y8w8a</code>
        </li>
        <li>
          Send <strong>ETH</strong> or tokens on any Ethereum network to: <code>rolod0x.eth</code>
          <br />
          (N.B. that's a zero before the <code>x</code>, not an uppercase <code>O</code> &emdash;
          the address should resolve to <code>0x06357397d8078C19195f4555db7A407b1b1f5FB3</code>.)
        </li>
      </ul>
      <Typography paragraph>
        Your contribution will go directly towards enhancing the project, covering development
        costs, and supporting ongoing maintenance.
      </Typography>
      <Typography paragraph>
        We appreciate every donation, no matter the size. It helps to ensure the project's
        sustainability and motivates us to continue delivering valuable updates and improvements.
      </Typography>
      <Typography paragraph>Thank you for considering a donation to support our work!</Typography>
    </Fragment>
  );
}
