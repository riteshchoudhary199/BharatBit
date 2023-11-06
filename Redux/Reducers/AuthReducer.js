import { createSlice } from "@reduxjs/toolkit";
import { clearUserData, removeItem, setItem, setUserData } from  '../../Utils/Utility';
const initialState = {
  userStartApp:true,
  userLoginStatus: {},
  userDetail:{},
  coinDetails:{},
  unreadNotifications:{}

};
export const AuthReducer = createSlice({
  name: "BharatBit",
  initialState,
  reducers: {
    appStart: (state, data) => {
      console.log("The appStart reduceer >>>>",data,"<<<");
      state.userStartApp = data?.payload;
    },
    login: (state, data) => {
      console.log("The login reduceer >>>>",data,"<<<");
    //   state.userLoginStatus = data?.payload;
    // state.userStartApp = false
      state.userLoginStatus = data?.payload;
    },
    logout: (state,data) => {
      console.log("The logout reduceer  >>>>:--",data,"<<<");
      // state.userStartApp = false
      state.userLoginStatus = data?.payload||{};
    },
    userProfile: (state,data) => {
      console.log("The userProfile reduceer >>>>",data,"<<<");
      state.userDetail = data?.payload?.getResponse;
      state.coinDetails = data?.payload?.coinDetails;
    },
    unreadNotifications: (state,data) => {
      console.log("unreadNotifications reduceer  >>>>:--",data,"<<<");
      // state.userStartApp = false
      state.unreadNotifications = data?.payload||{};
    },
  },
});
// Action creators are generated for each case reducer function
export const { appStart,login, logout,userProfile,unreadNotifications} = AuthReducer.actions;
export default AuthReducer.reducer;