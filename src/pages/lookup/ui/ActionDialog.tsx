import { Fragment } from 'react';
import DialogContentText from '@mui/material/DialogContentText';

import IframeModal from '@src/components/IframeModal';
import Rolod0xText from '@src/components/Rolod0xText';

import ActionBar from './ActionBar';

export default function ActionDialog() {
  const title = (
    <Fragment>
      <Rolod0xText bold /> address book lookup
    </Fragment>
  );

  return (
    <IframeModal id="lookup" title={title}>
      <DialogContentText sx={{ pb: 2 }}>
        Enter one or more search terms, space-separated:
      </DialogContentText>
      <ActionBar />
    </IframeModal>
  );
}
