
import React, { useEffect, useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableHighlight, TextInput, StatusBar } from "react-native";
import Colors from "../../../Colors/Colors";
import { ImagePath, En, AppFonts, Titles, Constants } from "../../../Constants";
import { CommonStyles, TextStyles } from "../../../Styles/ComnStyle";
import CustomTextInput from "../../../Components/CustomTextInput";
import { moderateScale, scale, textScale } from "../../../Styles/responsiveSize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import * as Components from "../../../Components/indexx"
import { selectImageOptions } from "../../../Utils/cameraFunction";
import Actions from "../../../Redux/Actions";
import { danger, showAlertMessage, success } from "../../../Utils/helperFunctions";
import { IMAGE_URl } from '../../../Constants/Urls';
import NavigationService from "../../../Services/NavigationService";

function EditProfile({ navigation }) {
    const profileDetail = useSelector((state) => state?.auth?.userDetail)
    console.log("user account profile useSelector data is ", profileDetail)

    const [countryCode, setCountryCode] = useState("91");
    const [countryFlag, setCountryFlag] = useState("IN");
    const [isEditing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const onChangeImage = (key, value) => {
        // updateState({ [key]: value });
        console.log("image key is ", key, "image value is", value.uri)
        uploadToServer(userDetail?.firstName, value?.uri)

    };


    function uploadToServer(name, profilePic) {

        const formData = new FormData();
        if (profilePic) {
            // formData.append("file",profilePic)
            setLoading(true)
            formData.append("file", {
                uri: profilePic?.uri,
                name: profilePic?.fileName,//`${name.split(" ").join("_") + "_" + new Date().getTime()}.jpg`,
                type: profilePic?.type,
            });

        } else {
            setLoading(false)
            return

        }
        console.log("form data file is ", formData)
        let header = {
            "Content-Type": "multipart/form-data",
        };
        Actions.updateUseProfilePic(formData, header).then((res) => {
            console.log("upload profile response is success res", res)

            setUserDeatail({ ...userDetail, profilePic: res?.data?.profilePic })
            // Actions.setDefaultStorage()
            showAlertMessage((res?.message) ? (res?.message) : (res?.error), alertType = (res?.error) ? danger : success)
            setLoading(false);
            Actions.startAppAction(false)
        })
            .catch((error) => {
                console.log("catch error in upload profile respons", error);
                showAlertMessage(error?.error, alertType = danger)
                setLoading(false);

            });
    }


    const [userDetail, setUserDeatail] = useState({
        email: '',
        country_code: '',
        mobile_no: '',
        password: '',
    });

    useEffect(() => {
        setUserDeatail({
            ...userDetail,
            firstName: profileDetail?.firstName,
            lastName: profileDetail?.lastName,
            email: profileDetail?.email,
            password: profileDetail?.password,
            mobile_no: profileDetail?.mobile_no,
            country_code: profileDetail?.country_code,
            profilePic: profileDetail?.profilePic
        })
    }, [])
    function onPressBack() {
        NavigationService.goBack()
    }
    async function onPressEditProfile() {
        selectImageOptions(onChangeImage, "profilePic")
    }
    function onPressChangePassword() {
        navigation.navigate(Constants.createPassword)
    }

    function UserImge() {
        return (
            <View style={styles.profileContainer}>
                <View>
                    {/* <Image style={styles.userImge} source={{uri:userDetail?.profilePic}} /> */}
                    <Components.LoaderImage
                        imageUrl={IMAGE_URl + ((userDetail?.profilePic) ? userDetail?.profilePic : '')}
                        style={styles.userImge}
                    />
                    <TouchableHighlight
                        style={styles.editProfile}
                        underlayColor={Colors.app_White}
                        onPress={() => onPressEditProfile()}
                    >
                        <Image source={ImagePath.pencil} />
                    </TouchableHighlight>
                </View>
                <Text style={{ ...TextStyles.medium, ...styles.userName }}> {`${userDetail.firstName} ${userDetail.lastName}`}</Text>
            </View>
        )

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_White }}>
 <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />
            {/* <ScreenWarpper> */}

            <KeyboardAwareScrollView>
                <View style={{ flex: 1, backgroundColor: Colors.app_White }}>
                    
                    <Components.BackBtnHeader
                    navigation={navigation}
                    />
                     {/* {Components.BackBtnHeader (navigation)} */}
                    <UserImge/>
                    <View style={{ marginHorizontal: 20 }}>
                        {/* // MARK: - Email Address TextField*/}
                        <View>
                            <CustomTextInput
                                containerStyle={{ ...styles.textInput }}
                                textStyle={{color:Colors.darkGrayTxt}}
                                innerContainerStyle={styles.textInputInnerContainer}
                                value={userDetail.email}
                                onChangeText={value => {
                                    setUserDeatail({ ...userDetail, email: value })
                                }}
                                editable={isEditing}
                                placeholder={En.emailAddress}
                                keyboardType={'email-address'}
                                isshowLeftImg={false}
                            />
                            <Text style={{ ...TextStyles.small, ...styles.placeholders }}>{En.email}</Text>
                        </View>
                        {/* // MARK: - Password TextField*/}
                        <View style={{ ...CommonStyles.textfieldContainer, ...styles.phoneNumberContainer, ...{ marginBottom: moderateScale(20) } }}>
                            <Text style={{ ...TextStyles.small, ...styles.placeholders }}>{En.phoneNumb}</Text>

                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Components.CountryCodePicker
                                pointerEvents={'none'}
                                    value={countryFlag}
                                    isShowRightArrow={false}
                                    showInput={true}
                                    countryFlag={countryFlag}
                                    countryCode={countryCode}
                                    onSelect={(country) => {
                                        setCountryFlag(country.cca2);
                                        setCountryCode(country.callingCode[0]);
                                    }}
                                />
                                <TextInput
                                    style={{ ...CommonStyles.textInput, ...styles.phoneInput,color:Colors.darkGrayTxt }} maxLength={15}
                                    placeholder={En.mobileNumber}
                              

                                    editable={isEditing}
                                    value={userDetail.mobile_no}
                                    onChangeText={value => {
                                        setUserDeatail({ ...userDetail, mobile_no: value })
                                    }}
                                    keyboardType={'phone-pad'}
                                />
                            </View>
                        </View>
                        <View>
                            {/* // MARK: - Password TextField*/}

                            <Components.CustomTextInput
                                containerStyle={{ ...styles.textInput, ...{ marginBottom: 10 } }}
                                innerContainerStyle={styles.textInputInnerContainer}
                                textStyle={{color:Colors.darkGrayTxt}}

                                onChangeText={value => {
                                    setUserDeatail({ ...userDetail, password: value })
                                }}
                                defaultSecure = {true}
                                secureTextEntry={true}
                                isShowRightArrow={false}
                                placeholder={En.password}
                                value={userDetail.password ?? '12345678'}
                                editable={isEditing}
                                leftImage={ImagePath.lock}
                                isshowLeftImg={false}
                                isTogleSecure={false}
                                imageEyeOpen={ImagePath.eyeOpenBlack}
                                imageEyeClose={ImagePath.eyeCloseBlack}
                                keyboardType={'email-address'}
                            />
                            <Text style={{ ...TextStyles.small, ...styles.placeholders }}>{En.password}</Text>
                        </View>

                        {/* MARK: - Button Change Password */}
                        <Components.CustomButton
                            title={Titles.changePassword}
                            containerStyle={styles.customButton}
                            onPress={() => onPressChangePassword()} />
                    </View>

                </View>
            </KeyboardAwareScrollView>
            {/* footer */}
            <View style={{
                flex: 1,
                justifyContent: 'flex-end',
            }}>

            </View>
            {loading && <Components.CustomLoader />}
            {/* footer */}
            {/* </ScreenWarpper> */}
        </SafeAreaView>


    )
}
export const styles = StyleSheet.create({
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center'
        , marginBottom: moderateScale(35),
        marginTop: moderateScale(10),
        gap: moderateScale(10)

    },
    userImge: {
        borderRadius: 100,
        height: scale(100),
        width: scale(100),
        borderColor: Colors.gradiantDwn,
        borderWidth: 1.2
        // borderWidth: 2
    },
    textInput: {
        marginBottom: moderateScale(20),
    },
    textInputInnerContainer: {
        backgroundColor: Colors.bg_textfld_dark,
        borderWidth: 1.2
    },
    userName: {
        color: Colors.darkGrayTxt,
        marginRight: moderateScale(5)
    },
    phoneNumberContainer: {
        // width: '18%',
        marginLeft: 0,
        marginBottom: moderateScale(20),
        borderWidth: 1.2,
        backgroundColor: Colors.bg_textfld_dark
        // height: 55
    },
    customButton: {
        marginTop: moderateScale(20),
    },
    btnLogin: {
        marginLeft: moderateScale(5),
        color: Colors.text_White
    },
    phoneInput: {
        paddingLeft: 0
        // backgroundColor:'yellow'
    },
    placeholders: {
        position: 'absolute', top: moderateScale(-6), left: moderateScale(15),
        backgroundColor: Colors.app_White, borderRadius: 8,
        paddingHorizontal: moderateScale(10), overflow: 'hidden', fontSize: textScale(12)
    },
    arrowBack: {
        height: moderateScale(25),
        width: moderateScale(25),
        resizeMode: 'contain',
        marginRight: moderateScale(5)
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(5),
        marginBottom: moderateScale(5),
        marginLeft: moderateScale(10)
    },
    editProfile: {

        borderWidth: 1.2,
        backgroundColor: Colors.app_White,
        borderRadius: 100,
        height: scale(23),
        width: scale(23),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        borderColor: Colors.gradiantDwn,
        bottom: moderateScale(3),
        right: moderateScale(10)


    }
})


export default EditProfile;

