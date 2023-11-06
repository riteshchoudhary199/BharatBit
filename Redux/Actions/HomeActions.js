import {ALL_COINS, DISPUTE_TYPES, HELP_SUPPORT_TITLES_LIST } from '../../Constants/Urls';
import { apiGet, apiPost, clearUserData } from '../../Utils/Utility';
import {allCoins, setDisputeTypes, setSupportTypes, updateOfferFilter, updateTransactionFilter } from '../Reducers/HomeReducer';
import { store } from '../Store';
const { dispatch } = store;

export const getAllCoins = (data) => {
  console.log(data, 'The userProfileAction action Data');
  return new Promise(async (resolve, reject) => {
    apiGet(ALL_COINS, {}, {}).then((res) => {
      let coinArr = res?.data?.overalldata
    dispatch(allCoins(coinArr));
    console.log('The GET_USER_DETAILS api respons',res );
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};
export const updateOferFilter = (data) =>{
  dispatch(updateOfferFilter(data));
}
export const updateTransactionFilters = (data) =>{
  dispatch(updateTransactionFilter(data));
}
// export const getDiputeTypes = (data) =>{
//   dispatch(updateTransactionFilter(data));
// }
export const getDiputeTypes = (data) => {
  console.log(data, 'The getDiputeTypes action Data');
  return new Promise(async (resolve, reject) => {
    apiGet(DISPUTE_TYPES, {}, {}).then((res) => {
      let coinArr = res?.data
    dispatch(setDisputeTypes(coinArr));
    console.log('The getDiputeTypes api respons',res );
    resolve(res)
  }).catch((error) => {
    console.log('The getDiputeTypes api error',error );
    reject(error)
  })
})
};
export const getSupportTypes = (data) => {
  console.log(data, 'The getSupportTypes action Data');
  return new Promise(async (resolve, reject) => {
    apiGet(HELP_SUPPORT_TITLES_LIST, {}, {}).then((res) => {
      let coinArr = res.data?.titles
    console.log('The getSupportTypes api respons',coinArr );
    dispatch(setSupportTypes(coinArr)); 

    resolve(res)
  }).catch((error) => {
    console.log('The getSupportTypes api error',error );

    reject(error)
  })
})
};
// export const createOffer = (data) => {
//     console.log(data, 'The action Data');
//     return new Promise(async (resolve, reject) => {
//     apiPost(CREATE_OFFER, data, {}).then((res) => {
//       // dispatch(createOffer(res?.data));
//       resolve(res)
//     }).catch((error) => {
//       reject(error)
//     })
//   })
//   };