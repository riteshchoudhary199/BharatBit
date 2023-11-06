
import React, { useEffect, useState, } from "react";
import { Alert,SafeAreaView, StyleSheet, Text, View,} from "react-native";
import Colors from "../../Colors/Colors";
import { TextStyles } from "../../Styles/ComnStyle";
// import ScreenWarpper from "../../Components/ScreenWrapper";
// import AuthCommonView from "../../Components/AuthCommonView";
import En from "../../Constants/En";
// import CustomButton from "../../Components/CustomButton";
// import GradientText from "../../Components/GradientText";
import AppFonts from "../../Constants/AppFonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useSelector, useDispatch} from 'react-redux'
import Titles from "../../Constants/Titles";
import Constants from "../../Constants/Constants";
import { moderateScale, scale } from "../../Styles/responsiveSize";
// import NavigationService from "../../Services/NavigationService";
import { danger, showAlertMessage, success, warning } from "../../Utils/helperFunctions";
import Actions from "../../Redux/Actions";
import { setUserData } from "../../Utils/Utility";
import * as Components from "../../Components/indexx"
import { RESEND_OTP, VERIFY_LOGIN_OTP, VERIFY_OTP } from "../../Constants/Urls";
import NavigationService from "../../Services/NavigationService";

function OtpVerify({ navigation,route }) {
    let signUpData = route?.params?.signUpData
    let loginData = route?.params?.loginData

    console.log(signUpData,'signupdata in otp>>>>')
    const dispatchAction = useDispatch()
    const CELL_COUNT = 6;
    const [value, setValue] = useState('');
    const [loading,setLoading] = useState(false)
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(30);

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useEffect(() => {
        const interval = setInterval(() => {
          if (seconds > 0) {
            setSeconds(seconds - 1);
          }
          if (seconds === 0) {
            if (minutes === 0) {
              clearInterval(interval);
            } else {
              setSeconds(59);
              setMinutes(minutes - 1);
            }
          }
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      }, [seconds]);

const resendOTP = () => {
  setMinutes(1);
  setSeconds(30);
};
    async function onPressContinue() {
        setLoading(true);
        const LoginPayloadData = {
            mobile_no: loginData?.mobile_no,
            otp: value
          }
        const signUpPayload = {
            email: signUpData?.email,
            otp: value
          }
          const url = loginData?VERIFY_LOGIN_OTP:VERIFY_OTP
          const payLoadData = loginData?LoginPayloadData:signUpPayload
        try {
             await Actions.VerifyOTPAction(url,payLoadData).then((res,rej)=>{
                console.log(res, "otp  verify  res");
                let sucess = res.status == 200
                Actions.setDefaultStorage(res?.data)
                setUserData(res?.data)
                let message = res?.message != "" ? res?.message:res?.error
                showAlertMessage(message = message,alertType = sucess?success:warning)
                setLoading(false);
            })
            
        } catch (error) {
           console.log("catch error in verify otp", error);
           let message = error?.message != "" ? error?.message:error.error
            showAlertMessage(message = message,alertType = danger)
            setLoading(false);
        }
        // dispatchAction(AuthenticateActions.verifyOTP(payload))
    }
    function onPressLogin() {
        NavigationService.navigate(Constants.login)
    }
    function onPressResendOtp() {
        resendOTP()
        let mobile_no = signUpData?.mobile_no

        const LoginPayloadData = {
            mobile_no: loginData?.mobile_no,
          }
        const signUpPayload = {
            email: signUpData?.email,
          }
          const url = loginData?RESEND_LOGIN_OTP:RESEND_OTP
          const payLoadData = loginData?LoginPayloadData:signUpPayload

        setLoading(true)
        Actions.resendOtp({mobile_no}).then((res) => {
            console.log("login signup otp generate res",res.message);
            resendOTP()
            showAlertMessage(message = (res.message)?(res.message):(res.error), alertType = (res.message)?success:danger)
            setLoading(false);
        }).catch((error) => {
            console.log("catch error in create password is :---- ", error);
            showAlertMessage(message = `${error?.error}`);
            setLoading(false);
        });
    }

    

    let authProp = { title: En.otp_verification, subtitle: En.enter_Six_Diagit_code }

    return (
        // <SafeAreaView style={{ flex: 1 }}>
        <Components.AppWrapper
        loading={loading}
        >
            <Components.ScreenWarpper>
            <Components.BackBtnHeader
            isSowText ={false}
            containerStyle={{marginTop:moderateScale(10)}}
                    navigation={navigation}
                    />
                <KeyboardAwareScrollView>
                    <View style={{ flex: 1 }}>
                        <Components.AuthCommonView prop={authProp} customStyle={styles.AuthCommon} />
                        <Text style={{ ...TextStyles.medium, ...styles.enterOtpTitle }}>{En.enterOtp}</Text>

                        {/* MARK:-- Otp Text Inputs */}
                        <CodeField
                            ref={ref}
                            {...props}
                            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                            value={value}
                            onChangeText={setValue}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            )}
                        />



                        {/* MARK:-- Resend Otp */}
                        <View style={styles.resendContainer}
                        >
                            <Text style={{ ...TextStyles.medium, ...styles.titleDontRecive }}>
                                {En.dont_recive_otp}
                            </Text>

                            {seconds > 0 || minutes > 0 ?
                                <View
                                    style={{ flexDirection: 'row', alignItems: "center", }}
                                >

                                    <Text style={{
                                            ...TextStyles.medium, ...styles.btnResend,
                                            // fontSize: 14
                                        }} >
                                     {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                                    </Text>
                                </View>:
                                 <Components.GradientText
                                 colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                                 onPress={() => onPressResendOtp()}
                                 style={{ ...TextStyles.medium, ...styles.btnResend }} >
                                 {Titles.ResendOtp}
                             </Components.GradientText>
                            }
                        </View>

                        {/* MARK:-- Continue Button */}

                        <View style={{ marginHorizontal: 20 }}>
                            <Components.CustomButton 
                            title={Titles.continue} 
                            isdisable={value.length< 6? true:false}
                            containerStyle={styles.customButton} 
                            onPress={() => onPressContinue()} />
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
            </Components.ScreenWarpper>
            {/* {loading && <Components.CustomLoader/>} */}
        {/* </SafeAreaView> */}
        </Components.AppWrapper>

    )
}
export const styles = StyleSheet.create({
    AuthCommon: {
        marginBottom:moderateScale(40) 
    },

    enterOtpTitle: {
        alignSelf: 'center',
        marginBottom:moderateScale(10),
    },
    customButton: {
        marginTop: moderateScale(150),
    },
    resendContainer: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',gap:5,
    },
    footerContainer: {
        height: moderateScale(50),
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.authfooterColor
    },
    footerTitle: {
        color: Colors.lightGreyTxt,
        fontFamily: AppFonts.bold
    }
    ,
    btnResend: {
        fontFamily: AppFonts.bold
    },
    titleDontRecive: {
        fontSize: 15,
        color: Colors.text_DarkGray
    },
    FooterLogin: {
        marginLeft: 5,
        textDecorationLine: 'underline',
        fontFamily: AppFonts.bold
    },
    // title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: { marginBottom:moderateScale(10),marginHorizontal: moderateScale(20) },
    cell: {
        width: scale(50),
        height: scale(50),
        lineHeight: scale(50),
        fontFamily: AppFonts.regular,
        fontSize: 24,
        borderWidth: 1.2,
        borderRadius: 8,
        borderColor: Colors.border_textfld_dark,
        textAlign: 'center',
        backgroundColor: Colors.bg_textfld,
        overflow: 'hidden',
        color:Colors.text_Black

    },
    focusCell: {
        borderColor: Colors.gradiantUp,
        fontFamily: AppFonts.regular,
        color: Colors.gradiantDwn,
    }, timerDotStyle: {
        fontSize: moderateScale(18),
        paddingBottom: moderateScale(3)
    },



})


export default OtpVerify;

