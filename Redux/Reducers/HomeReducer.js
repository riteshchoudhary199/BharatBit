import { createSlice } from "@reduxjs/toolkit";
import { clearUserData, removeItem, setItem, setUserData } from  '../../Utils/Utility';
const initialState = {
  allCoinsList:[{}],
  cretedOffer: {},
  offerFilter:{},
  transactionFilter:{ screen:'',tranSactionType: [], cryptoType: [], transactionStatus: [], dateRange: {from:'',to:''}},
  supportTypes:[],
  disputeTypes:{}
};
export const HomeReducer = createSlice({
  name: "HomeReducer",
  initialState,
  reducers: {
    allCoins: (state, data) => {
      // console.log("The allCoins reduceer >>>>",data,"<<<");
      state.allCoinsList = data?.payload;
    },
    createOffer: (state, data) => {
        // console.log("The allCoins reduceer >>>>",data,"<<<");
        state.cretedOffer = data?.payload;
      },
      updateOfferFilter: (state, data) => {
        // console.log("The allCoins reduceer >>>>",data,"<<<");
        state.offerFilter = data?.payload;
      },
      updateTransactionFilter: (state, data) => {
        // console.log("The allCoins reduceer >>>>",data,"<<<");
        state.transactionFilter = data?.payload;
      },
       setSupportTypes: (state, data) => {
        state.supportTypes = data?.payload;
      },
      setDisputeTypes: (state, data) => {
        state.disputeTypes = data?.payload;
      },
  },
});
// Action creators are generated for each case reducer function
export const { allCoins,createOffer,updateOfferFilter,updateTransactionFilter,setSupportTypes,setDisputeTypes} = HomeReducer.actions;
export default HomeReducer.reducer;