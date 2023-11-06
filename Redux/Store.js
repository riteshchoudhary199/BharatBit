import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import auth from './Reducers/AuthReducer';
import init from './Reducers/AppInitReducer';
import homeReducer from './Reducers/HomeReducer';
import wallet from './Reducers/WAlletReducer';
import notification from './Reducers/NotificationReducer';

const middleware = [thunk];
export const store = configureStore(
  {
    reducer: {
      auth: auth,
      init: init,
      homeReducer: homeReducer,
      wallet: wallet,
      notification: notification,
    },
  },
  applyMiddleware(...middleware)
);