
import {appInitReducer,} from '../Reducers/AppInitReducer';
import { currentNotification } from '../Reducers/NotificationReducer';
import { store } from '../Store';
const { dispatch } = store;
export const initAction = (data) => {
  console.log(data, 'The initAction action Data');
  dispatch(appInitReducer(data));
};

export const setNewNotification = (data) => {
  console.log(data, 'The setNewNotification action Data');
  dispatch(currentNotification(data));
};