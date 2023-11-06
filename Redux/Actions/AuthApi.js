import {
  ADMN_DETAILS,
  ADMN_WALLET,
  ADMN_WITHDRAW_PROFIT,
  CANCEL_DEAL,
  CHANGE_PASSWORD,
  CHAT_HISTORY,
  CHAT_LIST,
  CREATE_OFFER,
  DELETE_AN_OFFER,
  EDIT_OFFER,
  FAQ_LIST,
  GET_AN_OFFER_DETAIL,
  GET_OFFERS,
  GET_TRANSACTION_DETAIL,
  HELP_SUPPORT,
  HELP_SUPPORT_TITLES_LIST,
  MY_NOTIFICATIONS,
  MY_OFFER_HISTORY,
  MY_TRANSACTIONS,
  SEND_DEFAULT_MESSAGE,
  SIGNUP,
  STATUS_CHANGE,
  TRANSACTION,
  WITHDRAW,
  how_it_works
} from '../../Constants/Urls';
//   import { CustomPopUp } from "../../Components/CustomPopUp";
  import { apiGet, apiPost } from '../../Utils/Utility';
  
  export const SignUpAction = (data) => {
    console.log(data, "login signup Action>>>>>>>");
    return apiPost(SIGNUP, data, {});
  };
  export const VerifyOTPAction = (qwery,data) => {
    console.log(data, "VerifyLoginOTPAction>>>>>>>");
    return apiPost(qwery, data, {});
  };
  export const resendOtp = (qwery,data) => {
    console.log(data, "VerifyLoginOTPAction>>>>>>>");
    return apiPost(qwery, data, {});
  };
  export const changePassAction = (data) => {
    console.log(data, "LoginAction>>>>>>>");
    return apiPost(CHANGE_PASSWORD, data, {});
  };
  export const getAllOffers = (qwery,data) => {
    console.log(data, "LoginAction>>>>>>>");
    return apiGet(GET_OFFERS + qwery, data, {});
  };
  export const getChatList = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(CHAT_LIST + qwery, data, {});
  };
  export const getMytransactionList = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(MY_TRANSACTIONS + qwery, data, {});
  };
  export const getHelpAndSupportTitleList = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(HELP_SUPPORT_TITLES_LIST, data, {});
  };
  export const geMyTradeHistory = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(MY_OFFER_HISTORY + qwery, data, {});
  };
  // export const getChatMessageHistory = (qwery,data) => {
  //   console.log(data, "getChatMessageHistory>>>>>>>");
  //   return apiPost(CHAT_HISTORY + qwery, data, {});
  // };
  export const getAdminWalletAddress = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(ADMN_WALLET + qwery, data, {});
  };
  export const getAdminWithdrawProfit = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(ADMN_WITHDRAW_PROFIT, data, {});
  };
  export const getAdminDetails = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(ADMN_DETAILS, data, {});
  };
  export const howItWorks = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(how_it_works + qwery, data, {});
  };
  export const getFaqList = (data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(FAQ_LIST, data, {});
  };
  export const getNotificationList = (qwery,data) => {
    console.log(data, "getChatList>>>>>>>");
    return apiGet(MY_NOTIFICATIONS + qwery, data, {});
  };



  export const getChatMessageHistory = (qwery,data) => {
    console.log(data, 'The userProfileAction action Data');
    return new Promise(async (resolve, reject) => {
      apiPost(CHAT_HISTORY + qwery, data, {}).then((res) => {
      console.log(res, 'The getChatMessageHistory api respons');
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
  };

  export const transaction = (data) => {
    console.log(data, "transaction Action>>>>>>>");
    return apiPost(TRANSACTION, data, {});
  };
  export const updateStaus = (data) => {
    console.log(data, "updateStausAction>>>>>>>");
    return apiPost(STATUS_CHANGE, data, {});
  };
  export const withdraw = (data) => {
    console.log(data, "withdraw Action>>>>>>>");
    return apiPost(WITHDRAW, data, {});
  };
  export const getAnOfferDetail = (data) => {
    console.log(data, "getAnOfferDetail Action>>>>>>>");
    return apiPost(GET_AN_OFFER_DETAIL, data, {});
  };
  export const getAnTransactionDetail = (data) => {
    console.log(data, "getAnTransactionDetail Action>>>>>>>");
    return apiPost(GET_TRANSACTION_DETAIL, data, {});
  };
  
  export const deleteAnOffer = (data) => {
    console.log(data, "deleteAnOffer Action>>>>>>>");
    return apiPost(DELETE_AN_OFFER, data, {});
  };
  export const createOffer = (data) => {
    console.log(data, "LoginAction>>>>>>>");
    return apiPost(CREATE_OFFER, data, {});
  };
  export const updateOffer = (data) => {
    console.log(data, "updateOffer Action>>>>>>>");
    return apiPost(EDIT_OFFER, data, {});
  };
  export const cancelDeal = (data) => {
    console.log(data, "cancelDeal Action>>>>>>>");
    return apiPost(CANCEL_DEAL, data, {});
  };
  export const sendDefaultMessage = (data) => {
    console.log(data, "sendDefaultMessage Action>>>>>>>");
    return apiPost(SEND_DEFAULT_MESSAGE, data, {});
  };
  export const sendSupportMessage = (data) => {
    console.log(data, "sendDefaultMessage Action>>>>>>>");
    return apiPost(HELP_SUPPORT, data, {});
  };
