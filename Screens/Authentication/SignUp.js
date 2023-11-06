
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Colors from "../../Colors/Colors";
import { ImagePath, En, AppFonts, Titles, Constants, AutoCapitalizeEnum, Alerts, Localize } from "../../Constants";
import { CommonStyles, TextStyles } from "../../Styles/ComnStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from 'react-redux'
// import NavigationService from "../../Services/NavigationService";
import CustomLoader from "../../Components/CustomLoader";
import { Formik } from "formik";

import { moderateScale, textScale } from "../../Styles/responsiveSize";
import Actions from "../../Redux/Actions";
import { getCountryWithCountryCode, showAlertMessage, success, warning } from "../../Utils/helperFunctions";
import { signUpValidationSchema } from "../../Utils/validations";
import * as Components from "../../Components/indexx"
import { TouchableHighlight } from "react-native-gesture-handler";
import { getFcmToken } from "../../Utils/Utility";
import NavigationService from "../../Services/NavigationService";
import {getAllISOCodes,getAllInfoByISO} from '../../Utils/CurrencyPicker'

function SignUp({ navigation }) {
  const dispatchAction = useDispatch()
  const registerSelector = useSelector((state) => state.authenticate);
  const [dialCode, setDialCode] = useState("");
  const [countryCode, setCountryCode] = useState(Localize.countryCode);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [currencyName, setCurrencyName] = useState('');

  const [selectedCountry, setSelectedCountry] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [acceptsTerms, anChangeAcceptTerms] = useState(false)
  const [showTermsError, setTermsErrorStatus] = useState(false)



  function onPressAcceptTerms() {
    anChangeAcceptTerms(!acceptsTerms)
    setTermsErrorStatus(false)
  }
  function onPressPrivacyPolicy() {
    console.log("onPressPrivacyPolicy")
    const params = {title:'Privacy and Policy'}
    navigation.navigate(Constants.TermsConditions,params)

  }
  function onPressTerms() {
    console.log("onPressTerms")
    const params = {title:'Terms and Conditions'}
    navigation.navigate(Constants.TermsConditions,params)

  }

  useEffect(() => {
    getCurrentCountry()
    getCurrentCurrency()
  }, [countryCode])

  const getCurrentCurrency = async () => {
    let cuurency = await getAllInfoByISO(countryCode)
    // {"countryName": "India", "currency": "INR", "dateFormat": "d/M/yyyy", "iso": "IN", "symbol": "₹"}
    console.log('getCountryWithCountryCode :---',cuurency)
    setCurrencySymbol(cuurency?.symbol)
    setCurrencyName(cuurency?.name)
    // setSelectedCountry(contry)
    // setDialCode(contry?.callingCode[0])
  }


  const getCurrentCountry = async () => {
    const contry = await getCountryWithCountryCode(countryCode)
    console.log('getCountryWithCountryCode :---',contry)
    setSelectedCountry(contry)
    setDialCode(contry?.callingCode[0])
  }

  function onPressLogin() {
    NavigationService.goBack()
  }
  const _onSubmitFormData = async (data) => {

    if (!acceptsTerms) {
      setTermsErrorStatus(true)
      return
    } else {
      setTermsErrorStatus(false)
    }
    setLoading(true);

    const fcmToken = await getFcmToken().then((res) => {
      console.log('getFcmToken getFcmToken', res)
    }).catch((err) => {
      console.log('getFcmToken error', err)
      setLoading(false);
      showAlertMessage(JSON.stringify(err))
    })
    console.log("fcmToke fcmToke: --", fcmToken)

    const contry = getCountryWithCountryCode()
    const { firstName, lastName, email, phone, password } = data
    let registerPayload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      country_code: countryCode ?? '',
      currency_name:currencyName ?? 'usd',
      currency_symbol:currencySymbol ?? '$',
      country: selectedCountry?.name ?? '',
      dial_code: dialCode,
      mobile_no: phone,
      deviceToken: fcmToken,
      domain: ''
    }


    Actions.SignUpAction(registerPayload).then((res) => {
      console.log(res, "login signup otp generate res");
      let sucess = res.status == 200
      showAlertMessage(message = res?.message, alertType = sucess ? success : warning)
      navigation.navigate(Constants.OtpVerify, {
        signUpData:
          res?.data,
      });
      setLoading(false);
    }).catch((error) => {
      console.log("catch error in signup is :---- ", error);
      setLoading(false);
      showAlertMessage(message = error.error, alertType = warning);
    });
  }

  let authProp = { title: En.Welcome_to_BharatBit, subtitle: En.signUp_Subtitle }
  const closeAlert = () => {
    setShowModal(false)
    return true
  }
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <Components.AppWrapper
      loading={loading}
    >
      <Formik
        validationSchema={signUpValidationSchema}
        initialValues={{
          firstName: '', lastName: ''
          , email: '', phone: '',
          password: '', confimPass: '', acceptsTerms: false
        }}
        onSubmit={_onSubmitFormData}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => {
          return (
            <Components.ScreenWarpper>
              {/* <Components.BackBtnHeader
                    navigation={navigation}
                    /> */}
              {/* <Components.CustomPopUp
                onHardwareBackPress={closeAlert}
                onClickTouchOutside={closeAlert}
                scaleAnimationDialogAlert={showModal}
                HeaderTitle={En.User_Alreay_Exist}
                AlertMessageTitle={registerSelector?.userExistSuccessMessage}
                onOkPress={closeAlert}
              /> */}

              <KeyboardAwareScrollView >
                <View style={{ flex: 1 }}>


                  <Components.AuthCommonView prop={authProp} customStyle={styles.AuthCommon} />

                  <View style={{ marginHorizontal: 20, flex: 1 }}>

                    {/* // MARK: - First Name TextField*/}

                    <Components.CustomTextInput
                      // onChangeText={value => onChangeFirstName(value)}
                      containerStyle={{ ...styles.textInput, ...{ marginBottom: !(errors.firstName && touched.firstName) ? moderateScale(10) : moderateScale(5) } }}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                      placeholder={En.firstName}
                      leftImage={ImagePath.person}
                    />
                    {(errors.firstName && touched.firstName) &&
                      <Text style={TextStyles.errorText}>{errors.firstName}</Text>
                    }
                    {/* // MARK: - Last Name TextField*/}
                    <Components.CustomTextInput
                      containerStyle={{ ...styles.textInput, marginBottom: !(errors.lastName && touched.lastName) ? moderateScale(10) : moderateScale(5) }}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      placeholder={En.lasName}
                      leftImage={ImagePath.person}
                    />
                    {(errors.lastName && touched.lastName) &&
                      <Text style={TextStyles.errorText}>{errors.lastName}</Text>
                    }
                    {/* // MARK: - Email Address TextField*/}
                    <Components.CustomTextInput
                      containerStyle={{ ...styles.textInput, marginBottom: !(errors.email && touched.email) ? moderateScale(10) : moderateScale(5) }}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholder={En.emailAddress}
                      leftImage={ImagePath.mail}
                      keyboardType={'email-address'}
                      autoCapitalize={AutoCapitalizeEnum.none}
                    />
                    {(errors.email && touched.email) &&
                      <Text style={TextStyles.errorText}>{errors.email}</Text>
                    }
                    {/* // MARK: - Password TextField*/}
                    <Components.CustomTextInput
                      containerStyle={{ ...styles.textInput, marginBottom: !(errors.password && touched.password) ? moderateScale(10) : moderateScale(5) }}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry={true}
                      placeholder={En.password}
                      leftImage={ImagePath.lock}
                      keyboardType={'email-address'}
                    />
                    {(errors.password && touched.password) &&
                      <Text style={TextStyles.errorText}>{errors.password}</Text>
                    }
                    <Components.CustomTextInput
                      containerStyle={{ ...styles.textInput, marginBottom: !(errors.confimPass && touched.confimPass) ? moderateScale(10) : moderateScale(5) }}
                      onChangeText={handleChange('confimPass')}
                      onBlur={handleBlur('confimPass')}
                      value={values.confimPass}
                      secureTextEntry={true}
                      placeholder={En.confrmPassword}
                      leftImage={ImagePath.lock}
                      keyboardType={'email-address'}
                    />
                    {(errors.confimPass && touched.confimPass) &&
                      <Text style={TextStyles.errorText}>{errors.confimPass}</Text>
                    }
                    {/* MARK country Picker and button Block */}
                    <View style={{ flexDirection: 'row', marginBottom: !(errors.phone && touched.phone) ? moderateScale(15) : moderateScale(8) }}>

                      {/* MARK country Picker Btn */}
                      {/* ...CommonStyles.textfieldContainer, */}
                      <View style={{ ...styles.countyPickrContainer }}>
                        <Components.CountryCodePicker
                          value={values.phone}
                          showInput={true}
                          countryFlag={countryCode}
                          countryCode={countryCode}
                          onSelect={(country) => {
                            setCountryCode(country.cca2);
                            setDialCode(country.callingCode[0]);
                            setSelectedCountry(country)

                            // setCountryCode(country.callingCode[0]);
                          }}
                        />

                      </View>
                      {/* MARK phoneNumber textField */}
                      <Components.CustomTextInput
                        containerStyle={{ ...styles.textInput, flex: 1, marginLeft: 10, }}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                        placeholder={En.mobileNumber}
                        leftImage={ImagePath.mobile}
                        keyboardType={'phone-pad'}
                        maxLength={15}
                      />

                    </View>

                    {(errors.phone && touched.phone) &&
                      <Text style={{ ...TextStyles.errorText, }}>{errors.phone}</Text>
                    }
                    {/* } */}
                    {/* MARK country Picker and button Block */}


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: (isValid && showTermsError) ? moderateScale(15) : moderateScale(65) }}>
                      <TouchableHighlight
                        style={{ marginRight: 0, alignItems: 'center' }}
                        underlayColor={Colors.app_White}
                        onPress={() => onPressAcceptTerms()}
                      >
                        <Image source={acceptsTerms ? ImagePath.chek : ImagePath.unCheck} />
                      </TouchableHighlight>
                      <View style={{ marginHorizontal: 10 }}>
                        <Components.GradientText
                          colors={[Colors.lightGreyTxt_1, Colors.lightGreyTxt_1]}
                          style={{ ...TextStyles.small, ...styles.agreement }}>
                          {En.by_registering_you_are_agreeing}
                        </Components.GradientText>
                        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                          {/* MARK: Btn Terms of use */}
                          <Components.GradientText
                            colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                            onPress={() => onPressTerms()}
                            style={{ ...TextStyles.small, ...styles.term_Privacy }}
                          >
                            {En.terms_of_use}
                          </Components.GradientText>
                          <Components.GradientText
                            colors={[Colors.lightGreyTxt_1, Colors.lightGreyTxt_1]}
                            style={{ ...TextStyles.small, ...styles.agreement, }}>{En.and}</Components.GradientText>
                          {/* MARK: Btn PrivacyPolicy */}
                          <Components.GradientText
                            colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                            onPress={() => onPressPrivacyPolicy()}
                            style={{ ...TextStyles.small,...styles.term_Privacy, }}
                          >
                            {En.privacy_policy}
                          </Components.GradientText>
                        </View>
                      </View>
                    </View>

                    {(isValid && showTermsError) &&
                      <Text style={{ ...TextStyles.errorText, marginBottom: moderateScale(65) }}>{Alerts.PLEASE_ACCEPT_TERMS_FIRST}</Text>
                    }

                    {/* MARK: - Button Next */}
                    <Components.CustomButton title={Titles.Next}
                      containerStyle={styles.customButton}
                      // isdisable={!isValid}
                      onPress={
                        // () => onPressNext()
                        handleSubmit
                      } />
                    {/* MARK: - Bottom Footer */}
                  </View>
                </View>
              </KeyboardAwareScrollView>
              {/* footer */}
              <View style={styles.footerContainer}
              >
                <Text style={{ ...TextStyles.medium, ...styles.footerTitle }}>
                  {En.alreadyHaveAccount}
                </Text>
                <Components.GradientText
                  colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                  onPress={() => onPressLogin()}
                  style={{ ...TextStyles.medium, ...styles.FooterLogin }} >
                  {Titles.Log_in}
                </Components.GradientText>
              </View>
              {/* footer */}
              {/* {loading && <Components.CustomLoader/>} */}
            </Components.ScreenWarpper>


          )
        }}

      </Formik>
      {registerSelector?.authenticatedIsLoading && <CustomLoader />}
      {/* </SafeAreaView> */}

    </Components.AppWrapper>
  )
}
export const styles = StyleSheet.create({
  AuthCommon: {
    // backgroundColor: 'red',
  },
  textInput: {
    marginBottom: 0
  },
  countyPickrContainer: {
    backgroundColor: Colors.bg_textfld, flexDirection: 'row', borderRadius: 10,
    borderColor: Colors.border_textfld_dark, borderWidth: 1.5,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
  },
  customButton: {
    // marginTop: 60
  },
  btnLogin: {
    marginLeft: 5,
    color: Colors.text_White
  },
  footerContainer: {
    height: moderateScale(50), backgroundColor: Colors.footerColor, marginBottom: 0,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.authfooterColor
  },
  footerTitle: {
    color: Colors.lightGreyTxt,
    fontFamily: AppFonts.bold
  },
  FooterLogin: {
    marginLeft: 5,
    textDecorationLine: 'underline',
    fontFamily: AppFonts.bold
  },
  agreement: {
    color: Colors.text,
    fontFamily: AppFonts.regular
  },
  term_Privacy: {
    color: Colors.text_Black,
    fontFamily: AppFonts.regular,
    fontSize: textScale(14),
    textDecorationLine: 'underline',
  }
})


export default SignUp;

