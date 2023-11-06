

export const API_BASE_URL = 'https://apis.bharatbit.com/'//'https://bharatbit-apis.zip2box.com/'
export const SOCKET_URL = 'https://apis.bharatbit.com/' //'https://bharatbit-apis.zip2box.com/'

export const API_MIDPT_USER_URL = 'api/user/'
export const API_MIDPT_ADMIN_URL = 'api/admin/'


export const API_MIDPT_UPLOAD_URL = 'uploads/'

export const IMAGE_URl = API_BASE_URL + API_MIDPT_UPLOAD_URL

export const getUserApiUrl = (endpoint) => API_BASE_URL + API_MIDPT_USER_URL + endpoint;

export const getAdminApiUrl = (endpoint) => API_BASE_URL + API_MIDPT_ADMIN_URL + endpoint;
// authentication

// export const ALL_COINS = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=bitcoin,ethereum,tether'


// https://bharatbit-apis.zip2box.com/api/admin/wallet?coin=USDT

export const SIGNUP = getUserApiUrl('sign-up');
export const VERIFY_OTP = getUserApiUrl('verifyotp');
export const VERIFY_LOGIN_OTP = getUserApiUrl('verifyotp-login');

export const LOGIN = getUserApiUrl('login');
export const LOGOUT = getUserApiUrl('logout');
export const DELETE_USER_ACCOUNT = getUserApiUrl('userDelete');

export const FORGOT_PASS = getUserApiUrl('forgotPassword');
export const GET_USER_DETAILS = getUserApiUrl('myProfile');
export const GET_UNREADMESSAGE_COUNT = getUserApiUrl('unreadMessages');

export const UPDATE_PROFILE_PIC = getUserApiUrl("updateProfilePic");
export const UPLOAD_FILE = getUserApiUrl("uploadFile");
export const GET_OFFERS = getUserApiUrl("getOffers");//getOffers?pageNumber=1&pageLimit=10'
export const CHANGE_PASSWORD = getUserApiUrl("changePassword");
export const UPDATE_COUNTRY = getUserApiUrl("country");



export const ALL_COINS = getUserApiUrl("allCoins");
export const CREATE_OFFER = getUserApiUrl("createOffer");
export const EDIT_OFFER = getUserApiUrl("editOffer");
export const MY_TRANSACTIONS = getUserApiUrl("mytransactions");
export const how_it_works = getUserApiUrl("how_it_works");
export const FAQ_LIST = getUserApiUrl("faq");
export const MY_NOTIFICATIONS = getUserApiUrl("myNotifications");



export const MY_OFFER_HISTORY = getUserApiUrl("myOfferHistory");

export const RESEND_LOGIN_OTP = getUserApiUrl("resendotp-login");

export const RESEND_OTP = getUserApiUrl("resendotp");
export const TRANSACTION_DETAIL = getUserApiUrl("transaction");
export const CHAT_LIST = getUserApiUrl("chatSidebar");
export const CHAT_HISTORY = getUserApiUrl("chats");
export const GET_OFFER_DETAIL = getUserApiUrl("getAnOffer");

export const DEPOSIT = getUserApiUrl("deposit");
export const TRANSFER = getUserApiUrl("transfer");
export const WITHDRAW = getUserApiUrl("requestWithdraw");//withdraw

export const TRANSACTION = getUserApiUrl("transaction");
export const STATUS_CHANGE = getUserApiUrl("statusChange");
export const GET_AN_OFFER_DETAIL = getUserApiUrl("getAnOffer");
export const GET_TRANSACTION_DETAIL = getUserApiUrl("viewATransaction");
export const DELETE_AN_OFFER = getUserApiUrl("deleteAnOffer");
export const RAISE_A_DISPUTE = getUserApiUrl("raiseADispute");
export const CANCEL_DEAL = getUserApiUrl("cancelDeal");
export const SEND_DEFAULT_MESSAGE = getUserApiUrl("defaultmessage");
export const HELP_SUPPORT = getUserApiUrl("helpAndSupport");
export const LIVEPRICE = getUserApiUrl("liveprice");
export const HELP_SUPPORT_TITLES_LIST = getUserApiUrl("helpAndSupport_titles");
export const DISPUTE_TYPES = getUserApiUrl("disputeTypes");


export const ADMN_WALLET = getUserApiUrl("wallet");
export const ADMN_WITHDRAW_PROFIT = getUserApiUrl("profit");
export const ADMN_DETAILS = getUserApiUrl("adminDetails");
export const GET_PAYMENT_METHODS = getUserApiUrl("paymentmethods");
















