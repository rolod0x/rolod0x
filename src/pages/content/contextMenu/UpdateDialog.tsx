import { Fragment } from 'react';
import { DialogContentText } from '@mui/material';

import IframeModal from '@src/components/IframeModal';
import Rolod0xText from '@src/components/Rolod0xText';

import UpdateForm from './UpdateForm';

export default function UpdateDialog() {
  const title = (
    <Fragment>
      <Rolod0xText bold /> address book update
    </Fragment>
  );

  return (
    <IframeModal id="update" title={title}>
      <DialogContentText component="h2" sx={{ pb: 2 }}>
        Add a new address label
      </DialogContentText>
      <UpdateForm />
    </IframeModal>
  );
}
