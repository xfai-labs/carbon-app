import { ModalWallet } from 'libs/modals/modals/ModalWallet';
import {
  ModalTokenList,
  ModalTokenListData,
} from 'libs/modals/modals/ModalTokenList';
import { TModals } from 'libs/modals/modals.types';
import {
  ModalConfirm,
  ModalCreateConfirmData,
} from 'libs/modals/modals/ModalConfirm';
import {
  ModalImportToken,
  ModalImportTokenData,
} from 'libs/modals/modals/ModalImportToken';
import { ModalNotifications } from 'libs/modals/modals/ModalNotifications';
import {
  ModalTradeTokenList,
  ModalTradeTokenListData,
} from 'libs/modals/modals/ModalTradeTokenList';

// Step 1: Add modal key and data type to schema
export interface ModalSchema {
  wallet: undefined;
  tokenLists: ModalTokenListData;
  tradeTokenList: ModalTradeTokenListData;

  txConfirm: ModalCreateConfirmData;
  importToken: ModalImportTokenData;
  notifications: undefined;
}

// Step 2: Create component in modals/modals folder

// Step 3: Add modal component here
export const MODAL_COMPONENTS: TModals = {
  wallet: (props) => ModalWallet(props),
  tokenLists: (props) => ModalTokenList(props),
  txConfirm: (props) => ModalConfirm(props),
  importToken: (props) => ModalImportToken(props),
  notifications: (props) => ModalNotifications(props),
  tradeTokenList: (props) => ModalTradeTokenList(props),
};
