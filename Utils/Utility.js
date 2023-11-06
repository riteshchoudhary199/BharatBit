import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showAlertMessage } from "./helperFunctions";
import Actions from "../Redux/Actions";
export async function getHeaders() {
  let userData = await AsyncStorage.getItem("userData");
  if (userData != null) {
    userData = JSON.parse(userData);
    return {
      Authorization: `${userData?.token}`,
    };
  }
  return {};
}
export async function apiReq(
  endPoint,
  data,
  method,
  headers = {},
  requestOptions = {},
  // timeout = 10000
) {
  return new Promise(async (res, rej) => {
    const getTokenHeader = await getHeaders();
    console.log(getTokenHeader, "getTokenHeader")
    console.log(endPoint, "endPoint");
    console.log(method, "method");
    headers = {
      ...getTokenHeader,
      ...headers,
    };
    if (method === "get" || method === "delete") {
      data = {
        ...requestOptions,
        ...data,
        headers,
      };
    }
    // console.log("check param generator>>>", data);
    console.log("check Api data :>>>>>>>> \n",
    endPoint ,">>>>>>>>>" ,
    "\nParam are : ---- " ,data," >>>>>>>>>>>>" ,
    " header is : ----- " ,
    headers, "   >>>>>>>>", "\nApi is :-----" ,
   
       );
    //
  
    
    axios[method](endPoint, data, { headers })
      .then((result) => {
        console.log("POST RESPONSE: " + JSON.stringify(result));
        // console.log("api jacon respons is ",result.JSON)
        const { data } = result;
        if (data.error) {

        }
        if (data.message) {

        }
        if (data.status == 401) {
          const messg = data?.message != "" ? data?.message:data?.error

          console.log("message from status 401 is : -----",messg)
          showAlertMessage(messg)
          Actions.clearDefaultStorage({})
        }
        if (data.status === false) {
          return rej(data);
        }
        console.log(data, "Api rspons from main is");
        return res(data);
      })
      .catch((error) => {
        console.log(error, "Api error from main is");


       



        if (error.response.data.status == 401) {
          showAlertMessage(error?.response?.data?.message)
          Actions.clearDefaultStorage({})
        }
        if (axios.isCancel(error)) {
          // Handle request cancellation (if you have implemented cancellation logic)
          console.log("Request was canceled:", error.message);
        } else if (error.code === 'ECONNABORTED') {
          // Handle timeout error
          console.log("Request timed out:", error.message);
          showAlertMessage(`Request timed out. Please try again after some`)
          return rej(error);
        } 
        if (error.response) {
          // The request was made, but the server responded with a status code
          // that falls out of the range of 2xx
          console.log("error.response: -----", error.response, "    >>>>>>>>>>");

          const data = error?.response?.data
          const messg = data?.message != "" ? data?.message:data?.error

          showAlertMessage(messg)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        if (error && error.response && error.response.status === 401) {
          console.log(error);
          return rej(error);
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.error) {
            return rej({
              ...error.response.data,
              error: error.response.data.error || "Network Error",
            });
          }
          return rej(error.response.data);
        } else {
          return rej({ error: "Network Error", message: "Network Error" });
        }
        return rej(error);
      });
  });
}
export async function apiPost(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, "post", headers);
}
export function apiDelete(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, "delete", headers);
}
export function apiGet(endPoint, data, headers = {}, requestOptions) {
  return apiReq(endPoint, data, "get", headers, requestOptions);
}
export function apiPut(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, "put", headers);
}
export function setUserData(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem("userData", data);
}
export async function setFcmToken(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem("FcmToken", data);
}
export function setItem(key, data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem(key, data);
}
export function getItem(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then((data) => {
      resolve(JSON.parse(data));
    });
  });
}
export function removeItem(key) {
  return AsyncStorage.removeItem(key);
}
export function clearAsyncStorate(key) {
  return AsyncStorage.clear();
}
export async function getUserData() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("userData").then((data) => {
      resolve(JSON.parse(data));
    });
  });
}
export async function getFcmToken() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("FcmToken").then((data) => {
      resolve(JSON.parse(data));
    });
  });
}
export async function clearUserData() {
  return AsyncStorage.removeItem("userData");
}
