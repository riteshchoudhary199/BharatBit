import { FORGOT_PASS, LOGIN, LOGOUT,GET_USER_DETAILS, UPDATE_PROFILE_PIC, RESEND_OTP, UPLOAD_FILE, RAISE_A_DISPUTE, UPDATE_COUNTRY, GET_UNREADMESSAGE_COUNT, DELETE_USER_ACCOUNT, } from '../../Constants/Urls';
import { apiGet, apiPost, clearUserData } from '../../Utils/Utility';
import { showAlertMessage } from '../../Utils/helperFunctions';
import { login, logout,appStart, userProfile,unreadNotifications } from '../Reducers/AuthReducer';
import { store } from '../Store';
const { dispatch } = store;


export const startAppAction = (data) => {
    dispatch(appStart(data))
};

export const loginAction = (data) => {
  console.log(data, 'The action Data');
  return new Promise(async (resolve, reject) => {
  apiPost(LOGIN, data, {}).then((res) => {
    dispatch(appStart(false))
    dispatch(login(res?.data));
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};
export const forgotPassword = (data) => {
  console.log(data, 'The action Data');
  return new Promise(async (resolve, reject) => {
  apiPost(FORGOT_PASS, data, {}).then((res) => {
    // dispatch(login(res?.data));
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};
export const setDefaultStorage = (data) => {
  console.log(data, 'The setDefaultStorage Data is >>>');
    dispatch(login(data))
};
export const clearDefaultStorage = (data) => {
    return new Promise(async (resolve, reject) => {
      dispatch(logout({}));
      clearUserData().then((res)=>{
        console.log(res,"clearUserData clearUserDataAction dataaaaa>>>>>>>");
        dispatch(logout({}));
        resolve(res)
      }).catch((error)=>{
        console.log(error,"clearUserData error from clearUserDataAction dataaaaa>>>>>>>");
        showAlertMessage('Fail to clear default storage')
        dispatch(logout({}));
        reject(error)
      })
    })
};
export const logoutAction = (query) => {
  console.log("logoutAction dataaaaa>>>>>>>");
  return new Promise(async (resolve, reject) => {
    apiGet(LOGOUT+query,{}, {}).then((res) => {
    
      clearUserData().then((res1)=>{
        console.log(res1,"logout api respons from logoutAction dataaaaa>>>>>>>");
        // Actions.startAppAction(false)
        dispatch(appStart(false))
        dispatch(logout({}));
        resolve(res)
      }).catch((error)=>{
        console.log(error,"logout api respons error from logoutAction dataaaaa>>>>>>>");
        reject(error)
      })
    }).catch((error) => {
      reject(error)
    })
  })
};
export const deleteProfileAction = (data) => {
  console.log("deleteProfileAction dataaaaa>>>>>>>");
  return new Promise(async (resolve, reject) => {
    apiGet(DELETE_USER_ACCOUNT,{data}, {}).then((res) => {
    
      clearUserData().then((res1)=>{
        console.log(res1,"logout api respons from deleteProfileAction dataaaaa>>>>>>>");
        // Actions.startAppAction(false)
        dispatch(appStart(false))
        dispatch(logout({}));
        resolve(res)
      }).catch((error)=>{
        console.log(error,"logout api respons error from deleteProfileAction dataaaaa>>>>>>>");
        reject(error)
      })
    }).catch((error) => {
      reject(error)
    })
  })
};
export const userProfileAction = (data) => {
  console.log(data, 'The userProfileAction action Data');
  return new Promise(async (resolve, reject) => {
    apiGet(GET_USER_DETAILS,data,{}).then((res) => {
    dispatch(userProfile(res?.data));
    console.log(res, 'The GET_USER_DETAILS api respons');
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};
export const getNotificationsCount = (data) => {
  // console.log(data, 'The userProfileAction action Data');
  return new Promise(async (resolve, reject) => {
    apiGet(GET_UNREADMESSAGE_COUNT,{},{}).then((res) => {
    console.log(res, 'The getNotificationsCount api respons');
    dispatch(unreadNotifications(res?.data));
    resolve(res)
  }).catch((error) => {
    console.log( 'The getNotificationsCount api error : ---- ',error);

    reject(error)
  })
})
};
export const updateUseProfilePic = (data,header) => {
  console.log(data, 'The userProfileAction action Data');
  return new Promise(async (resolve, reject) => {
    apiPost(UPDATE_PROFILE_PIC, data, header).then((res) => {
    dispatch(userProfile(res?.data));
    console.log(res, 'The GET_USER_DETAILS api respons');
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};
export const updateUserCountry = (data,header) => {
  console.log(data, 'The updateUserCountry action Data');
  return new Promise(async (resolve, reject) => {
    apiPost(UPDATE_COUNTRY, data, header).then((res) => {
    console.log(res, 'The updateUserCountry api respons');
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};
export const updloadFile = (data,header) => {
  console.log(data, 'The userProfileAction action Data');
  return new Promise(async (resolve, reject) => {
    apiPost(UPLOAD_FILE, data, header).then((res) => {
    console.log(res, 'The GET_USER_DETAILS api respons');
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};
export const raiseADispute = (data,header) => {
  console.log(data, 'The userProfileAction action Data');
  return new Promise(async (resolve, reject) => {
    apiPost(RAISE_A_DISPUTE, data, header).then((res) => {
    console.log(res, 'The GET_USER_DETAILS api respons');
    resolve(res)
  }).catch((error) => {
    reject(error)
  })
})
};

