import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userData:{},
};
export const AppInitReducer = createSlice({
  name: "appinit",
  initialState,
  reducers: {
    appInitReducer: (state, data) => {
      state.userData = data?.payload
      console.log(data,"The appInitReducer userData is");
    },
  },
});
// Action creators are generated for each case reducer function
export const { appInitReducer, } = AppInitReducer.actions;
export default AppInitReducer.reducer;