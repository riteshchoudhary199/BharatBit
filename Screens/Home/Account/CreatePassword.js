
import React, { useState } from "react";
import { Alert, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "../../../Colors/Colors";
import * as Components from "../../../Components/indexx";
import { AppFonts, Constants, En, ImagePath, Titles } from "../../../Constants";
import { TextStyles } from "../../../Styles/ComnStyle";
import { moderateScale } from "../../../Styles/responsiveSize";
import { Formik } from "formik";
import { changePasswordValidationSchema } from "../../../Utils/validations";
import Actions from "../../../Redux/Actions";
import { danger, success,showAlertMessage } from "../../../Utils/helperFunctions";
import NavigationService from "../../../Services/NavigationService";

function CreatePassword({ navigation }) {
    const [loading, setLoading] = useState(false);

    const onPressChangePass = (data) => {
        console.log(data)
        setLoading(true);
        const plyload = {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        }
        Actions.changePassAction(plyload).then((res) => {
            console.log("login signup otp generate res",res.message);
            // setLoading(false);
            showAlertMessage(message = (res.message)?(res.message):(res.error), alertType = (res.message)?success:danger)
            setLoading(false);
            if (res.status == 200){
                NavigationService.goBack()
            }
        }).catch((error) => {
            console.log("catch error in create password is :---- ", error);
            showAlertMessage(message = `${error?.error}`);
            setLoading(false);
        });
    }


    let authProp = { title: En.change_Password, subtitle: En.signUp_Subtitle }

    return (
       
        <SafeAreaView style={{ flex: 1,backgroundColor:Colors.app_White }}>
             <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />
            <Formik
                validationSchema={changePasswordValidationSchema}
                initialValues={{ oldPassword: '', newPassword: '', confimPass: '' }}
                onSubmit={onPressChangePass}ß
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => {

                    return (

                            <KeyboardAwareScrollView>
                                <View style={{ flex: 1 ,backgroundColor:Colors.app_White}}>
                                <Components.BackBtnHeader
                    navigation={navigation}
                    />
                                    <Components.AuthCommonView prop={authProp} customStyle={styles.AuthCommon} />

                                    <View style={{ marginHorizontal: moderateScale(20), }}>

                                        <Components.CustomTextInput
                                            containerStyle={{ ...styles.textInput, marginBottom: !(errors.oldPassword && touched.oldPassword) ? moderateScale(16) : moderateScale(5) }}
                                            onChangeText={handleChange('oldPassword')}
                                            onBlur={handleBlur('oldPassword')}
                                            value={values.oldPassword}
                                            secureTextEntry={true}
                                            placeholder={En.oldPassword}
                                            leftImage={ImagePath.lock}
                                            keyboardType={'email-address'}
                                        />
                                        {(errors.oldPassword && touched.oldPassword) &&
                                            <Text style={TextStyles.errorText}>{errors.oldPassword}</Text>
                                        }
                                        {/* // MARK: - Last Name TextField*/}
                                        <Components.CustomTextInput
                                            containerStyle={{ ...styles.textInput, marginBottom: !(errors.newPassword && touched.newPassword) ? moderateScale(16) : moderateScale(5) }}
                                            onChangeText={handleChange('newPassword')}
                                            onBlur={handleBlur('newPassword')}
                                            value={values.newPassword}
                                            secureTextEntry={true}
                                            placeholder={En.newPassword}
                                            leftImage={ImagePath.lock}
                                            keyboardType={'email-address'}
                                        />
                                        {(errors.newPassword && touched.newPassword) &&
                                            <Text style={TextStyles.errorText}>{errors.newPassword}</Text>
                                        }
                                        <Components.CustomTextInput
                                            containerStyle={{ ...styles.textInput, marginBottom: !(errors.confimPass && touched.confimPass) ? moderateScale(10) : moderateScale(5) }}
                                            onChangeText={handleChange('confimPass')}
                                            onBlur={handleBlur('confimPass')}
                                            value={values.confimPass}
                                            secureTextEntry={true}
                                            placeholder={En.confirmNewpassword}
                                            leftImage={ImagePath.lock}
                                            keyboardType={'email-address'}
                                        />
                                        {(errors.confimPass && touched.confimPass) &&
                                            <Text style={TextStyles.errorText}>{errors.confimPass}</Text>
                                        }
                                        {/* MARK MARK Forget Password */}

                                        {/* MARK: - Button CreatePassword*/}
                                        <Components.CustomButton title={Titles.changePassword} containerStyle={styles.customButton} onPress={handleSubmit} />

                                        {/* MARK: - Bottom Footer */}
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        
                    )
                }}
            </Formik>
            {loading && <Components.CustomLoader/>}
        </SafeAreaView>


    )
}
export const styles = StyleSheet.create({
    AuthCommon: {
        // backgroundColor: 'red',
    },
    textInput: {
        marginBottom: moderateScale(20)
    },
    countyPickrContainer: {
        // width: '18%',
        marginLeft: moderateScale(15)
        // height: 55
    },
    customButton: {
        marginTop: moderateScale(150),
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
        fontFamily: AppFonts.medium,
    }
    ,
    FooterLogin: {
        marginLeft: moderateScale(5),
        textDecorationLine: 'underline',
        fontFamily: AppFonts.bold
    },
    arrowBack: {
        height: moderateScale(25),
        width: moderateScale(25),
        resizeMode: 'contain',
        marginRight: moderateScale(5),
        backgroundColor: Colors.transparent
    },
    userName: {
        color: Colors.darkGrayTxt,
        marginRight: moderateScale(5)
    },

})


export default CreatePassword;

