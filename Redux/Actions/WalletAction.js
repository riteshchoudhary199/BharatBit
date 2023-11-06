import {MY_TRANSACTIONS, DEPOSIT, TRANSACTION_DETAIL,TRANSFER, LIVEPRICE, ADMN_DETAILS, GET_PAYMENT_METHODS} from '../../Constants/Urls';
import { CoinDetail } from '../../Screens/ScreensIndex';
import { apiGet, apiPost, clearUserData } from '../../Utils/Utility';
import { login, logout,appStart, userProfile, allCoins } from '../Reducers/HomeReducer';
import { setAdminDetail, setCoinDetail,getPayMetods } from '../Reducers/WAlletReducer';
import { store } from '../Store';
const { dispatch } = store;

export const getMyTransactions = (query,data) => {
  console.log(data, 'The userProfileAction action Data');
  return new Promise(async (resolve, reject) => {
    apiGet(MY_TRANSACTIONS + query, {}, {}).then((res) => {
    console.log('The GET_USER_DETAILS api respons',res );
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};
export const createTransactionDetail = (data) => {
    console.log(data, 'The action Data');
    return new Promise(async (resolve, reject) => {
    apiPost(TRANSACTION_DETAIL, data, {}).then((res) => {
      dispatch(createOffer(res?.data));
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
  };
  export const depositCoins = (data) => {
    console.log(data, 'The action Data');
    return new Promise(async (resolve, reject) => {
    apiPost(DEPOSIT, data, {}).then((res) => {
      // dispatch(createOffer(res?.data));
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
  };

  export const transactionCoinsToAnotherUser = (data) => {
    console.log(data, 'The action Data');
    return new Promise(async (resolve, reject) => {
    apiPost(TRANSFER, data, {}).then((res) => {
      // dispatch(createOffer(res?.data));
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
  };

  export const getCoinsLivePrices = async(data) => {
    console.log(data, 'The action Data');
    return new Promise(async (resolve, reject) => {
      apiGet(LIVEPRICE, data, {}).then(async(res) => {
        console.log('getCoinsLivePrices from action Data : ----',res)
        if (res) {
          await updateLivePrices(res)

        }
      // dispatch(setCoinDetail(res?.data));
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
  };

  export const getPaymentMethods = (qwery,data) => {
    console.log(data, 'The userProfileAction action Data');
    return new Promise(async (resolve, reject) => {
      apiGet(`${GET_PAYMENT_METHODS}${qwery}`,data,{}).then((res) => {
        const payments = res?.data?.payments
      console.log(res, 'The GET_PAYMENT_METHODS api respons',payments);

      dispatch(getPayMetods(payments));
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
  };
  
  export const getAdminDetails = async(data) => {
    console.log(data, 'The action Data');
    return new Promise(async (resolve, reject) => {
      apiGet(ADMN_DETAILS, data, {}).then(async(res) => {
        console.log('getAdminDetails : ----',res)
        const data = res?.data
        if (data) {
          dispatch(setAdminDetail(data))
        }
      // dispatch(setCoinDetail(res?.data));
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
  };
  export const updateLivePrices = async (data) => {
     dispatch(setCoinDetail(data));
  };