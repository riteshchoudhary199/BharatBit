// import Alerts from '../Constants/';
import * as yup from 'yup';
import { Alerts } from '../Constants';
import { showAlertMessage } from './helperFunctions';
export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email(Alerts.PLEASE_ENTER_VALID_EMAIL)
    .required(Alerts.PLEASE_ENTER_YOUR_EMAIL),
  password: yup
    .string()
    .min(8, ({ min }) => `${Alerts.Password_must_be} ${min} ${Alerts.characters}`)
    .required(Alerts.PLEASE_ENTER_PASSWORD),
})
export const forgotPassValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email(Alerts.PLEASE_ENTER_VALID_EMAIL)
    .required(Alerts.PLEASE_ENTER_YOUR_EMAIL),
})

export const signUpValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(4, ({ min }) => `${Alerts.FirstName_must_be} ${min} ${Alerts.characters}`)
    .required(Alerts.PLEASE_ENTER_YOUR_FirstName)
  ,
  // lastName: yup
  //   .string()
  //   .required(Alerts.PLEASE_ENTER_YOUR_LastName)
  // ,
  email: yup
    .string()
    .email(Alerts.PLEASE_ENTER_VALID_EMAIL)
    .required(Alerts.PLEASE_ENTER_YOUR_EMAIL),
  password: yup
    .string()
    .matches(/\w*[a-z]\w*/, `${Alerts.Password_must_have_a} ${Alerts.small_letter}`)
    .matches(/\w*[A-Z]\w*/, `${Alerts.Password_must_have_a} ${Alerts.capital_letter}`)
    .matches(/\d/, `${Alerts.Password_must_have_a} ${Alerts.number}`)
    .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/,`${Alerts.Password_must_have_a}${Alerts.special_character}`)
    .min(8, ({ min }) => `${Alerts.Password_must_be} ${min} ${Alerts.characters}`)
    .required(Alerts.PLEASE_ENTER_PASSWORD),
  confimPass: yup
    .string()
    .oneOf([yup.ref('password')], `${Alerts.Password_not_matched}`)
    .required(`${Alerts.PLEASE_ENTER_Confirm_PASSWORD}`),
  phone: yup
    .string()
    .matches("^\\d{7,12}$", `${Alerts.PLEASE_ENTER_VALID_PHONE_NUMBER}`)
    .required(Alerts.PLEASE_ENTER_YOUR_PHONE_NUMBER),


})

export const changePasswordValidationSchema = yup.object().shape({
  oldPassword: yup
  .string()
  .matches(/\w*[a-z]\w*/, `${Alerts.Password_must_have_a} ${Alerts.small_letter}`)
  .matches(/\w*[A-Z]\w*/, `${Alerts.Password_must_have_a} ${Alerts.capital_letter}`)
  .matches(/\d/, `${Alerts.Password_must_have_a} ${Alerts.number}`)
  .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/,`${Alerts.Password_must_have_a}${Alerts.special_character}`)
  .min(8, ({ min }) => `${Alerts.Password_must_be} ${min} ${Alerts.characters}`)
  .required(Alerts.PLEASE_ENTER_OLD_PASSWORD),
  newPassword: yup
  .string()
  .matches(/\w*[a-z]\w*/, `${Alerts.Password_must_have_a} ${Alerts.small_letter}`)
  .matches(/\w*[A-Z]\w*/, `${Alerts.Password_must_have_a} ${Alerts.capital_letter}`)
  .matches(/\d/, `${Alerts.Password_must_have_a} ${Alerts.number}`)
  .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/,`${Alerts.Password_must_have_a}${Alerts.special_character}`)
  .min(8, ({ min }) => `${Alerts.Password_must_be} ${min} ${Alerts.characters}`)
  .required(Alerts.PLEASE_ENTER_NEW_PASSWORD),
confimPass: yup
  .string()
  .oneOf([yup.ref('newPassword')], `${Alerts.Password_not_matched}`)
  .required(`${Alerts.PLEASE_ENTER_Confirm_PASSWORD}`),
})

export const validateCreteOffer = (selectedCoin,CoinQty,ammount,country,title,discription) =>{

  // return(
    if (!selectedCoin){
     showAlertMessage("plese select coin")
      return 
    } else if (!CoinQty) {
      showAlertMessage("plese add coin Qty")
      return 

    }else if (!ammount) {
      showAlertMessage("plese add coin Qty")
      return 
    }
    else if (!country) {
      showAlertMessage("plese select country")
      return 
    }
    else if (!title) {
      showAlertMessage("plese add title")
      return 
    }
    else if (!discription) {
      showAlertMessage("plese add discription")
      return 
    }



  // )


}

/*
const checkEmpty = (val, key, key2 = true) => {
  if (validator.empty(val.trim())) {
    return `${Alerts.PLEASE_ENTER} ${key2 ? `${Alerts.YOUR} ` : ''}${key}`;
  } else {
    return '';
  }
};

const checkEmptyForSelection = (val, key, key2 = true) => {
  if (validator.empty(val)) {
    return `${Alerts.PLEASE_SELECT} ${key2 ? `${Alerts.YOUR} ` : ''}${key}`;
  } else {
    return '';
  }
};

const checkMinLength = (val, minLength, key) => {
  if (val.trim().length < minLength) {
    return `${Alerts.PLEASE_ENTER_VALID} ${key}`;
  } else {
    return '';
  }
};

const checkNumeric = (val, key) => {
  if (isNaN(val)) {
    return false;
  } else {
    return `${Alerts.PLEASE_ENTER_VALID_NUMERIC} ${key}`;
  }
};


*/







// export default function (data) {
//   let error = '';
//   const {
//     username,
//     email,
//     name,
//     password,
//     phoneNumber,
//     newPassword,
//     confirmPassword,
//   //   message,
//     otp,
//   //   address,
//   //   street,
//   //   city,
//   //   pincode,
//   //   states,
//   //   country,
//   //   callingCode,
//   //   promocode,
//   //   vendorName,
//   //   vendorAddress,
//   //   driverType,
//   //   driverTeam,
//   //   driverTransportDetails,
//   //   driverUID,
//   //   driverLicencePlate,
//   //   driverColor,
//   //   driverTransportType,
//   //   selectedBuisnessType,
//   //   productCategory,
//   //   productDetail,
//   //   productName,
//   //   mrp,
//   //   salePrice,
//   //   vendorLogo,
//   //   vendorTitle,
//   //   vendorDesc,
//   //   isTermsConditions,
//   //   price,
//   //   aadharNumber,
//   //   aadharFrontImg,
//   //   aadharBackImg,
//   //   upiId,
//   //   bankName,
//   //   beneficiaryName,
//   //   accountNumber,
//   //   ifscCode,
//   //  houseNo,
//   } = data;
//   if (username !== undefined) {
//     let emptyValidationText = checkEmpty(username, Alerts.NAME);
//     if (emptyValidationText !== '') {
//       return emptyValidationText;
//     } else {
//       let minLengthValidation = checkMinLength(username, 3, Alerts.NAME);
//       if (minLengthValidation !== '') {
//         return minLengthValidation;
//       }
//     }
//   }

//   if (name !== undefined) {
//     let emptyValidationText = checkEmpty(name, Alerts.NAME);
//     if (emptyValidationText !== '') {
//       return emptyValidationText;
//     } else {
//       let minLengthValidation = checkMinLength(name, 3, Alerts.NAME);
//       if (minLengthValidation !== '') {
//         return minLengthValidation;
//       }
//     }
//   }
//   // if (selectedBuisnessType !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     selectedBuisnessType,
//   //     Alerts.ENTER_NEW_ADDRESS,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (productCategory !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     productCategory,
//   //     Alerts.ENTER_NEW_ADDRESS,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (productName !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     productName,
//   //     Alerts.PRODUCT_NAME,
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (productDetail !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     productDetail,
//   //     Alerts.ENTER_PRODUCT_DESC,
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (mrp !== undefined) {
//   //   let emptyValidationText = checkEmpty(mrp, Alerts.ENTER_NEW_ADDRESS);
//   //   let checkNumericValue = checkNumeric(mrp, Alerts.ENTER_NEW_ADDRESS);
//   //   console.log(checkNumericValue, 'checkNumericValue');
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   } else if (checkNumericValue) {
//   //     return checkNumericValue;
//   //   }
//   // }
//   // if (salePrice !== undefined) {
//   //   let emptyValidationText = checkEmpty(salePrice, Alerts.ENTER_NEW_ADDRESS);
//   //   let checkNumericValue = checkNumeric(salePrice, Alerts.ENTER_NEW_ADDRESS);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   } else if (checkNumericValue) {
//   //     return checkNumericValue;
//   //   }
//   // }
//   // if (price !== undefined) {
//   //   let emptyValidationText = checkEmpty(price, Alerts.PRICE, false);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (address !== undefined) {
//   //   let emptyValidationText = checkEmpty(address, Alerts.ENTER_NEW_ADDRESS);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (street !== undefined) {
//   //   let emptyValidationText = checkEmpty(street, Alerts.ENTER_STREET);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (city !== undefined) {
//   //   console.log(city, 'city>>>>>>>>>>>');
//   //   let emptyValidationText = checkEmpty(city, Alerts.CITY);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (states !== undefined) {
//   //   let emptyValidationText = checkEmpty(states, Alerts.STATE);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (country !== undefined) {
//   //   let emptyValidationText = checkEmpty(country, Alerts.COUNTRY);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (pincode !== undefined) {
//   //   let emptyValidationText = checkEmpty(pincode, Alerts.PINCODE);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (lastName !== undefined) {
//   // 	let emptyValidationText = checkEmpty(lastName, 'last name');
//   // 	if (emptyValidationText !== '') {
//   // 		return emptyValidationText;
//   // 	} else {
//   // 		let minLengthValidation = checkMinLength(lastName, 3, 'Last name');
//   // 		if (minLengthValidation !== '') {
//   // 			return minLengthValidation;
//   // 		}
//   // 	}
//   // // }

//   // if (date !== undefined) {
//   // 	let emptyValidationText = checkEmpty(date, 'date');
//   // 	if (emptyValidationText !== '') {
//   // 		return emptyValidationText;
//   // 	} else {
//   // 		if (validator.date(date)) {
//   // 			ToastAndroid.showWithGravityAndOffset(`please Valid ${date}`,
//   //   ToastAndroid.LONG,
//   //   ToastAndroid.TOP,
//   //   0,
//   //   100
//   //   )
//   // 			return 'Please enter valid email';
//   // 		}
//   // 	}
//   // }

//   if (email !== undefined) {
//     if (email === 'emptyValid') {
//       return;
//     }
//     let emptyValidationText = checkEmpty(email, Alerts.EMAIL);
//     if (emptyValidationText !== '') {
//       Alert.alert(emptyValidationText)
//       return emptyValidationText;
//     } else {
//       if (!validator.email(email)) {
//         return Alerts.PLEASE_ENTER_VALID_EMAIL;
//       }
//     }
//   }

//   if (phoneNumber !== undefined) {
//     if (phoneNumber === 'emptyValid') {
//       return;
//     }
//     // let emptyValidationText = checkEmpty(phoneNumber, Alerts.PHONE_NUMBER);
//     // if (emptyValidationText !== '') {
//     //   return emptyValidationText;
//     // }
   

//     // let isTrue = isValidPhoneNumber(`+${callingCode}${phoneNumber}`);

//     if (phoneNumber == '') {
//       Alert.alert( Alerts.PLEASE_ENTER_YOUR_PHONE_NUMBER)
//       return Alerts.PLEASE_ENTER_YOUR_PHONE_NUMBER;
//     }
//     if (!/^[0][1-9]$|^[0-9]\d{4,14}$/.test(phoneNumber)) {
//       Alert.alert( Alerts.PLEASE_ENTER_VALID_PHONE_NUMBER)
//       return Alerts.PLEASE_ENTER_VALID_PHONE_NUMBER;
//     }
//     // if (isTrue) {
//     // } else {
//     //   return Alerts.PHONE_NUMBER_NOT_VALID;
//     // }
//   }

//   if (otp !== undefined) {
//     let emptyValidationText = checkEmpty(otp, Alerts.OTP);
//     if (emptyValidationText !== '') {
//       return emptyValidationText;
//     }
//   }

//   // if(emailMobile!==undefined){
//   // 	let emptyValidationText = checkEmpty(emailMobile, 'Email or mobile');
//   // 	if (emptyValidationText !== '') {
//   // 		return emptyValidationText;
//   // 	}
//   // 	if (!/^[0][1-9]$|^[1-9]\d{8,14}$/.test(emailMobile)) {
//   // 		if (!validator.email(emailMobile)) {
//   // 			return 'Please enter valid email or mobile';
//   // 		}
//   // 	}
//   // }

//   // if (vendorTitle !== undefined) {
//   //   let emptyValidationText = checkEmpty(vendorTitle, 'title', false);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   if (password !== undefined) {
//     let emptyValidationText = checkEmpty(password, Alerts.PASSWORD);
//     if (emptyValidationText !== '') {
//       return emptyValidationText;
//     } else {
//       let minLengthValidation = checkMinLength(password, 6, Alerts.PASSWORD);
//       if (minLengthValidation !== '') {
//         if (password != undefined) {
//           return Alerts.PASSWORD_REQUIRE_SIX_CHARACTRES;
//         }
//         return Alerts.INVALID_PASSWORD;
//       }
//     }
//   }

//   // if (newPassword !== undefined) {
//   //   let emptyValidationText = checkEmpty(newPassword, Alerts.PASSWORD);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   } else {
//   //     let minLengthValidation = checkMinLength(
//   //       newPassword,
//   //       6,
//   //       Alerts.PASSWORD,
//   //     );
//   //     if (minLengthValidation !== '') {
//   //       if (newPassword != undefined) {
//   //         return Alerts.NEW_PASSWORD_REQUIRE_SIX_CHARACTRES;
//   //       }
//   //       return Alerts.NEW_INCORRECT_PASSWORD;
//   //     }
//   //   }
//   // }

//   if (confirmPassword !== undefined) {
//     let emptyValidationText = checkEmpty(
//       confirmPassword,
//       Alerts.CONFIRM_PASSWORD,
//     );
//     if (emptyValidationText !== '') {
//       return emptyValidationText;
//     }
//     if (confirmPassword != newPassword) {
//       return Alerts.PASSWORD_NOT_MATCH;
//     }
//   }

//   // if (message !== undefined) {
//   //   let emptyValidationText = checkEmpty(message, Alerts.MESSAGE);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   } else {
//   //     let minLengthValidation = checkMinLength(message, 6, Alerts.MESSAGE);
//   //     if (minLengthValidation !== '') {
//   //       return Alerts.PLEASE_ENTER_AT_LEAST_SIX_CHARACTERS;
//   //     }
//   //   }
//   // }

//   // if (promocode !== undefined) {
//   //   let emptyValidationText = checkEmpty(promocode, Alerts.PROMO_CODE);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   } else {
//   //     let minLengthValidation = checkMinLength(
//   //       promocode,
//   //       3,
//   //       Alerts.PROMO_CODE,
//   //     );
//   //     if (minLengthValidation !== '') {
//   //       return minLengthValidation;
//   //     }
//   //   }
//   // }

//   // if (vendorLogo !== undefined) {
//   //   if (validator.empty(vendorLogo)) {
//   //     return 'Please upload vendor logo';
//   //   }
//   // }

//   // if (vendorName !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     vendorName,
//   //     Alerts.ENTER_VENDOR_NAME,
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   } else {
//   //     let minLengthValidation = checkMinLength(
//   //       vendorName,
//   //       3,
//   //       Alerts.ENTER_VENDOR_NAME,
//   //     );
//   //     if (minLengthValidation !== '') {
//   //       return minLengthValidation;
//   //     }
//   //   }
//   // }

//   // if (vendorDesc !== undefined) {
//   //   let emptyValidationText = checkEmpty(vendorDesc, 'description', false);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (vendorAddress !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     vendorAddress,
//   //     Alerts.VENDOR_ADDRESS,
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if(!isTermsConditions){
//   //   return "Please accecpt Terms & Conditions"
//   // }

//   // if (driverType !== undefined) {
//   //   let emptyValidationText = checkEmptyForSelection(
//   //     driverType,
//   //     'valid driver type',
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (driverTeam !== undefined) {
//   //   let emptyValidationText = checkEmptyForSelection(
//   //     driverTeam,
//   //     'valid driver team',
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (driverTransportDetails !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     driverTransportDetails,
//   //     'year, make , model',
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (driverUID !== undefined) {
//   //   let emptyValidationText = checkEmpty(driverUID, Alerts.UID, false);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (driverLicencePlate !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     driverLicencePlate,
//   //     'valid Licence Plate',
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (driverColor !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     driverColor,
//   //     'valid color name',
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (driverTransportType !== undefined) {
//   //   let emptyValidationText = checkEmptyForSelection(
//   //     driverTransportType,
//   //     'valid transport type',
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // //

//   // if (aadharNumber !== undefined) {
//   //   let emptyValidationText = checkEmpty(aadharNumber, 'Aadhar number', false);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (aadharFrontImg !== undefined) {
//   //   if (isEmpty(aadharFrontImg)) {
//   //     return 'Please upload Aadhar front image';
//   //   }
//   // }

//   // if (aadharBackImg !== undefined) {
//   //   if (isEmpty(aadharBackImg)) {
//   //     return 'Please upload Aadhar back image';
//   //   }
//   // }

//   // if (upiId !== undefined) {
//   //   let emptyValidationText = checkEmpty(upiId, 'UPI id', false);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (bankName !== undefined) {
//   //   let emptyValidationText = checkEmpty(bankName, 'bank name', false);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (beneficiaryName !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     beneficiaryName,
//   //     'account holder name',
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }

//   // if (accountNumber !== undefined) {
//   //   let emptyValidationText = checkEmpty(
//   //     accountNumber,
//   //     'account number',
//   //     false,
//   //   );
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (ifscCode !== undefined) {
//   //   let emptyValidationText = checkEmpty(ifscCode, 'IFSC code', false);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
//   // if (houseNo !== undefined) {
//   //   let emptyValidationText = checkEmpty(houseNo, Alerts.HOUSE_NO);
//   //   if (emptyValidationText !== '') {
//   //     return emptyValidationText;
//   //   }
//   // }
// }

