import * as auth from './AuthActions';
import * as authApi from './AuthApi';
import * as appInit from './AppInitActions';
import * as homeActions from './HomeActions';
import * as walletActions from './WalletAction';


export default {
  ...auth,
  ...authApi,
  ...appInit,
  ...homeActions,
  ...walletActions,
};