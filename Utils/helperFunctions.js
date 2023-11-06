
import { Clipboard, Platform } from "react-native";
import { FlagType, getAllCountries } from "react-native-country-picker-modal";
import { showMessage } from "react-native-flash-message";
import { useSelector } from "react-redux";
import Localize from "./Localize";

// import moment from "moment";
// import Clipboard from "@react-native-clipboard/clipboard";
const danger = 'danger'
const success = 'success'
const info = 'info'
const warning = 'warning'
const defalt = 'default'
const none = 'none'

// "none" | "default" | "info" | "success" | "danger" | "warning"

const getIconUrl = (endPoint) => {
  return (
    `../Assets/Icons/${endPoint}.png`
  )
};

const showError = (message) => {
  showMessage({
    type: "danger",
    // icon: "danger",
    message,
  });
};

const showSuccess = (message) => {
  showMessage({
    type: "success",
    // icon: "success",
    message,
  });
};

const showInfo = (message) => {
  showMessage({
    type: "info",
    // icon: "info",
    message,
  });
};
const showWarning = (message) => {
  showMessage({
    type: "warning",
    // icon: "warning",
    message: message,
  });
};
function formatNumberToFixed(number, toFix = 6, isNumber = false) {
  const parsedNumber = Number(number);
  if (isNaN(parsedNumber)) {
    return 0; // Return an empty string for NaN input
  }
  const foxedBy = toFix === '' ? 6:toFix
  const fixedString = parsedNumber.toFixed(foxedBy);
  const trimmedString = fixedString.replace(/\.?0+$/, '') ?? 0; // Remove trailing zeros and optional decimal point
  if (isNumber) {
    return Number(trimmedString);
  } else {
    return trimmedString;

  }
}
function showAlertMessage(message, alertType = danger, position = 'top') {
  {
    (message) &&
      showMessage({
        type: alertType,
        icon: alertType,
        message: message,
        floating: true,
        position: position
      });
  }
}
export function otpTimerCounter(seconds) {
  // alert(seconds)
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  return `${m}:${s}`;
}
const currencySymbol = (type) => {
  switch (type) {
    case "INR":
      return '₹'
    case "USD":
      return '$'
    default:
      break;
  }

}
const print = (message) => {
  return (
    console.log(message)
  )
};
const copyText = async (text) => {
  Clipboard.setString(text);
  if (text && Platform.OS === 'ios') {
    showAlertMessage(`Copy to Clipboard\n \n ${text}`, none, 'bottom')
  }

};
const convertNormalToMetaMaskPrice = (price) => {
  return price * (10 ** 18)
}

const calculateSellingCoinsQty = async ({ marketPrice, sellingPrice }) => {
  const total = sellingPrice / marketPrice
  return total
}
const calcuTotalCounAmunt = async ({ itemPrice, Qty }) => {
  const total = parseFloat(itemPrice) * parseFloat(Qty)
  return total
}

const getPriceInPercent = async (totalPrice, percentage) => {
  const total = parseFloat(totalPrice) / 100 * parseFloat(percentage)
  return total

}
const getCountryWithCountryCode = async (cntryCode) => {
  const allCountries = await getAllCountries(FlagType.FLAT); // import getAllCountries from this library
  const country = allCountries.find((item) => item.cca2 === cntryCode !== undefined ? cntryCode : Localize.countryCode);
  if (country?.name) {
    return country
  } else {
    return null
  }
};

const getCountryCurrencyCountryCode = async (cntryCode) => {
  const allCountries = await getAllCountries(FlagType.FLAT); // import getAllCountries from this library
  const country = allCountries.find((item) => item.cca2 === cntryCode !== undefined ? cntryCode : Localize.countryCode);

  // console.log( 'getCountryCurrencyCountryCode : ----',cntryCode,'country?.currency',country?.currency[0])
  if (country?.currency.length > 0) {
    return country?.currency[0]
  } else {
    return 'usd'
  }
};
const delayed = (delayInms = 3000) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

export {
  currencySymbol, showError, showSuccess, showInfo, showWarning, showAlertMessage, convertNormalToMetaMaskPrice,
  danger, success, warning, info, defalt, none, print, getIconUrl, copyText,
  calculateSellingCoinsQty, getPriceInPercent, calcuTotalCounAmunt, formatNumberToFixed,
  getCountryWithCountryCode, getCountryCurrencyCountryCode, delayed
};





// export const copyWalletAddress = async (walletAddress) => {
//   await Clipboard.setString(walletAddress);
//   // let copiedContent = await Clipboard.getString();
//   // console.log(walletAddress, copiedContent, "walletAddresswalletAddress");
//   showSuccess("Address Copied...!!");
// };




export const validDesAdd_Amount = (desAddress, amountToSend) => {
  if (desAddress.length < 5) {
    showError(strings.ENTER_VALID_WALLET_ADDRESS);
    return false;
  } else if (amountToSend == null) {
    showError(strings.ENTER_VALID_AMOUNT);
    return false;
  }
  return true;
};

export const _onMoveToNextScreen = (navigation, screenName, data) => {
  navigation.navigate(screenName, data)
}
