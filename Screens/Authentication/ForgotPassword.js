
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, } from "react-native";
import Colors from "../../Colors/Colors";
import ImagePath from "../../Constants/ImagePath";
import { TextStyles } from "../../Styles/ComnStyle";
// import ScreenWarpper from "../../Components/ScreenWrapper";
// import AuthCommonView from "../../Components/AuthCommonView";
import { En, Constants, AppFonts, Titles, AutoCapitalizeEnum, Alerts } from "../../Constants";
// import CustomTextInput from "../../Components/CustomTextInput";
// import CustomButton from "../../Components/CustomButton";
// import GradientText from "../../Components/GradientText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
// import CustomLoader from "../../Components/CustomLoader";
import { useDispatch, useSelector } from 'react-redux'
// import NavigationService from "../../Services/NavigationService";
// import CustomPopUp from "../../Components/CustomPopUp";
import Actions from "../../Redux/Actions";
import { danger, showAlertMessage, success, warning } from "../../Utils/helperFunctions";
// import { setUserData } from "../../Utils/Utility";
import { moderateScale } from "../../Styles/responsiveSize";
import { forgotPassValidationSchema } from "../../Utils/validations";

import * as Components from "../../Components/indexx"
import NavigationService from "../../Services/NavigationService";

function ForgotPassword({ navigation }) {
    const loginSelector = useSelector((state) => state.authenticate);

    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false);

    function onPressLogin() {
        navigation.navigate(Constants.login)
    }
    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    let authProp = { title: En.forgot_Password, subtitle: En.Enter_your_email_send_email }
    const _onSubmitFormData = (data) => {
        console.log(data)
        const params = { email: data?.email, domain: 'https://bharatbit.zip2box.com/' }
        setLoading(true);
        Actions.forgotPassword(params)
            .then((res) => {
                console.log(res, "logout success res")
                showAlertMessage(res?.message, success)
                setLoading(false);
                NavigationService.goBack()
            })
            .catch((error) => {
                console.log("catch error in logout", error);
                showAlertMessage(error?.error, danger)
                setLoading(false);
            });
    }


    return (
        // <SafeAreaView style={{ flex:0, backgroundColor: 'red' }} />
        // <SafeAreaView style={{ flex: 1 }}>
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: Colors.authfooterColor }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.authfooterColor }}>
                <View style={{ flex: 1, }}>
                    <Formik
                        validationSchema={forgotPassValidationSchema}
                        initialValues={{ email: '' }}
                        onSubmit={_onSubmitFormData}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => {
                            return (
                                <Components.ScreenWarpper>
                                    <Components.BackBtnHeader
                                        navigation={navigation}
                                    />
                                    <KeyboardAwareScrollView >
                                        <View style={{ flex: 1 }}>
                                            <Components.AuthCommonView prop={authProp} customStyle={styles.AuthCommon} />
                                            <View style={{ marginHorizontal: 20, }}>
                                                {/* // MARK: - Email Address TextField*/}
                                                <Components.CustomTextInput
                                                    // containerStyle={styles.textInput},
                                                    containerStyle={{ ...styles.textInput, ...{ marginBottom: !(errors.email && touched.email) ? 10 : 5 } }}
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
                                                {/* MARK MARK Forgot Password */}

                                                {/* MARK: - Button Login */}
                                                <Components.CustomButton title={Titles.Send}
                                                    containerStyle={{ ...styles.customButton }}
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
                                                onPress={() => onPressLogin()}
                                                style={{ ...TextStyles.medium, ...styles.FooterLogin }} >
                                                {Titles.Log_in}
                                            </Components.GradientText>
                                            {/* </LinearGradient> */}
                                        </View>
                                    </View>

                                    {/* footer */}
                                </Components.ScreenWarpper>
                            )
                        }}
                    </Formik>
                    {loading && <Components.CustomLoader />}

                </View>
            </SafeAreaView>
        </>

    )
}
export const styles = StyleSheet.create({
    AuthCommon: {
        // backgroundColor: 'red',
    },
    textInput: {
        marginBottom: 15
    },
    countyPickrContainer: {
        // width: '18%',
        marginLeft: 15
        // height: 55
    },
    customButton: {
        marginTop: moderateScale(185),
    },
    btnLogin: {
        marginLeft: 5,
        color: Colors.text_White
    },
    footerContainer: {
        height: 50, marginBottom: 0,
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
        fontFamily: AppFonts.medium,
    }
    ,
    FooterLogin: {
        marginLeft: 5,
        textDecorationLine: 'underline',
        fontFamily: AppFonts.bold
    },

})


export default ForgotPassword;

