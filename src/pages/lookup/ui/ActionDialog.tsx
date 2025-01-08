import { Fragment } from 'react';

import IframeModal from '@src/components/IframeModal';
import Rolod0xText from '@src/components/Rolod0xText';

import AddressChooser from './AddressChooser';

export default function ActionDialog() {
  const title = (
    <Fragment>
      <Rolod0xText bold /> address book lookup
    </Fragment>
  );

  return (
    <IframeModal id="lookup" title={title}>
      <AddressChooser />
    </IframeModal>
  );
}
