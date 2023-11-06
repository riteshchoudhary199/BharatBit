import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentNotification:{},
};
export const NotificationReducer = createSlice({
  name: "notificationReducer",
  initialState,
  reducers: {
    currentNotification: (state, data) => {
      state.currentNotification = data?.payload
      console.log(data,"The appInitReducer userData is");
    },
  },
});
// Action creators are generated for each case reducer function
export const { currentNotification } = NotificationReducer.actions;
export default NotificationReducer.reducer;