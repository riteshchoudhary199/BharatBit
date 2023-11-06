
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import Colors from "../../Colors/Colors";
import ImagePath from "../../Constants/ImagePath";
import { CommonStyles, TextStyles } from "../../Styles/ComnStyle";
import { En, Constants, AppFonts, Titles, AutoCapitalizeEnum, Alerts } from "../../Constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import { useSelector } from 'react-redux'
import Actions from "../../Redux/Actions";
import { danger, showAlertMessage, success, warning } from "../../Utils/helperFunctions";
import { getFcmToken, setUserData } from "../../Utils/Utility";
import { moderateScale } from "../../Styles/responsiveSize";
import { loginValidationSchema } from "../../Utils/validations";
import * as Components from "../../Components/indexx"
function Login({ navigation }) {

  const loginSelector = useSelector((state) => state.authenticate);

  const [password, onChangePassword] = useState('');
  const [emailAddr, onChangeEmailAddr] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false);

  

  function onPressSignUp() {
    navigation.navigate(Constants.signUp)
  }
  function onPressForgotPass() {
    navigation.navigate(Constants.forgotPassword)
  }
  const closeAlert = () => {
    setShowModal(false)
    return true
  }

  let authProp = { title: En.log_in, subtitle: En.signUp_Subtitle }

  const _onSubmitFormData = async (data) => {
    setLoading(true);
    const fcmToken = await getFcmToken()
    // .then((res)=>{
    //   console.log('getFcmToken getFcmToken',res)
    // }).catch((err)=>{
    //   console.log('getFcmToken error',err)
    //   setLoading(false);
    //   showAlertMessage(JSON.stringify(err))
    // })
    console.log("fcmToke fcmToke: --",fcmToken)

    const apiPerams = {...data,deviceToken:fcmToken}
    console.log("apiPerams apiPerams: --",apiPerams)

    Actions.loginAction(apiPerams)
      .then((res) => {
        console.log("user login res", res,);
        let data = res?.data
        const payLoad = { loginData: data }
        if (res?.status == 200) {
          navigation.navigate(Constants.OtpVerify, payLoad)
        }
        // setUserData(data)
        let sucess = res?.status == 200
        showAlertMessage(message = res?.message, alertType = sucess ? success : warning)
        setLoading(false);
      })
      .catch((error) => {
        console.log("catch error in login is :---- ", error);
        setLoading(false);
        showAlertMessage(message = error?.error, alertType = danger)
      });
  }

  return (
    <Components.AppWrapper
      loading={loading}
    >

      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={_onSubmitFormData}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => {


          return (
            <Components.ScreenWarpper>
              <KeyboardAwareScrollView
              enableOnAndroid = {true}
              >
                <View style={{ flex: 1, marginBottom: moderateScale(50), }}>
                  <Components.AuthCommonView prop={authProp} customStyle={styles.AuthCommon} />
                  <View style={{ marginHorizontal: moderateScale(20) }}>
                    {/* // MARK: - Email Address TextField*/}
                    <Components.CustomTextInput
                      // containerStyle={styles.textInput},
                      containerStyle={{ ...styles.textInput, ...{ marginBottom: !(errors.email && touched.email) ? moderateScale(12) : moderateScale(5) } }}
                      value={values.email}
                      // onChangeText={value => onChangeEmailAddr(value)}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder={En.emailAddress}
                      leftImage={ImagePath.mail}
                      keyboardType={'email-address'}
                      autoCapitalize={AutoCapitalizeEnum.none} jkkb
                    />
                    {(errors.email && touched.email) &&
                      <Text style={TextStyles.errorText}>{errors.email}</Text>
                    }
                    {/* // MARK: - Password TextField*/}
                    <Components.CustomTextInput
                      containerStyle={{ ...styles.textInput, ...{ marginBottom: !(errors.password && touched.password) ? moderateScale(8) : moderateScale(5) } }}
                      // onChangeText={value => onChangePassword(value)}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry={true}
                      placeholder={En.password}
                      value={values.password}
                      leftImage={ImagePath.lock}
                      keyboardType={'email-address'}
                    />
                    {/* <TextInput
                      // {...props}
                      style={{ ...CommonStyles.textInput, }} 
                      placeholder={'dff'} 
                      value={password}
                      placeholderTextColor={Colors.placeholder}

                      //  secureTextEntry={true}
                      onChangeText={(text) => {
                        onChangePassword(text)
                      }}
                     secureTextEntry={true}
                    // selectTextOnFocus={true}
                    /> */}
                    {(errors.password && touched.password) &&
                      <Text style={TextStyles.errorText}>{errors.password}</Text>
                    }
                    {/* MARK MARK Forgot Password */}
                    <View
                      style={styles.forgetBtnContainer}>
                      <Text
                        style={{ ...TextStyles.medium, ...styles.forgetBtnTitle, }}
                        suppressHighlighting={true}
                        onPress={() => onPressForgotPass()}
                      >
                        {Titles.forget_password}
                      </Text>
                    </View>

                    {/* MARK: - Button Login */}
                    <Components.CustomButton title={Titles.Log_in}
                      containerStyle={styles.customButton}
                      // isdisable={!isValid}
                      onPress={
                        handleSubmit
                      } />
                  </View>

                </View>
              </KeyboardAwareScrollView>
              {/* footer */}
              <View style={{
                // flex: 1,
                justifyContent: 'flex-end',
                // marginBottom: getStatusBarHeight(true)-30rrrr
              }}>
                <View style={styles.footerContainer}
                >

                  <Text style={{ ...TextStyles.medium, ...styles.footerTitle }}>
                    {En.dont_have_account}
                  </Text>

                  <Components.GradientText
                    colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                    onPress={() => onPressSignUp()}
                    style={{ ...TextStyles.medium, ...styles.FooterLogin }} >
                    {Titles.Signup}
                  </Components.GradientText>
                  {/* </LinearGradient> */}
                </View>
              </View>

              {/* footer */}
            </Components.ScreenWarpper>
          )
        }}
      </Formik>

      {/* </SafeAreaView> */}

    </Components.AppWrapper>
  )
}
export const styles = StyleSheet.create({
  AuthCommon: {
    // backgroundColor: 'red',
  },
  textInput: {
    marginBottom: moderateScale(15)
  },
  countyPickrContainer: {
    // width: '18%',
    marginLeft: moderateScale(15)
    // height: 55
  },
  customButton: {
    marginTop: moderateScale(40),
  },
  btnLogin: {
    marginLeft: moderateScale(5),
    color: Colors.text_White
  },
  footerContainer: {
    height: moderateScale(50), backgroundColor: Colors.gradiantDwn, marginBottom: 0,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.authfooterColor
  },
  footerTitle: {
    color: Colors.lightGreyTxt,
    fontFamily: AppFonts.bold
  },
  forgetBtnContainer: {
    marginTop: 0,
    alignSelf: 'flex-end'
  },
  forgetBtnTitle: {
    color: Colors.lightGreyTxt,
    fontSize: 18,
    fontFamily: AppFonts.medium,
  }
  ,
  FooterLogin: {
    marginLeft: moderateScale(5),
    textDecorationLine: 'underline',
    fontFamily: AppFonts.bold
  },

})


export default Login;

