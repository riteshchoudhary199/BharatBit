import { createSlice } from "@reduxjs/toolkit";
import { clearUserData, removeItem, setItem, setUserData } from '../../Utils/Utility';
const initialState = {
  allCoinsList: {},
  cretedOffer: {},
  coinsDetails: {},
  adminDetails: {},
  paymentMethods: [],
  

};
export const WalletReducer = createSlice({
  name: "WalletReducer",
  initialState,
  reducers: {
    allCoins: (state, data) => {
      // console.log("The allCoins reduceer >>>>", data, "<<<");
      state.allCoinsList = data?.payload;
    },
    setCoinDetail: (state, data) => {
      // console.log("The allCoins reduceer >>>>", data, "<<<");
      state.coinsDetails = data?.payload;
    },
    createOffer: (state, data) => {
      // console.log("The allCoins reduceer >>>>", data, "<<<");
      state.cretedOffer = data?.payload;
    },
    setAdminDetail: (state, data) => {
      // console.log("The allCoins reduceer >>>>", data, "<<<");
      state.adminDetails = data?.payload;
    },
    getPayMetods: (state, data) => {
      state.paymentMethods = data?.payload;
    },
  },
});
// Action creators are generated for each case reducer function
export const { allCoins, setCoinDetail, setAdminDetail,getPayMetods, } = WalletReducer.actions;
export default WalletReducer.reducer;