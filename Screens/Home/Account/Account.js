//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, SafeAreaView, FlatList, StatusBar, Pressable } from 'react-native';
import Colors from '../../../Colors/Colors';
import { ImagePath, Titles, Constants, Alerts, ImageEnum, Localize } from '../../../Constants';
import { moderateScale, moderateScaleVertical, textScale } from '../../../Styles/responsiveSize';
import { TextStyles } from '../../../Styles/ComnStyle';
import Actions from '../../../Redux/Actions';
import CustomLoader from '../../../Components/CustomLoader';
import { _onMoveToNextScreen, copyText, danger, delayed, showAlertMessage, success } from '../../../Utils/helperFunctions';
import { useSelector } from 'react-redux';
import * as Components from "../../../Components/indexx"
import DeviceInfo from 'react-native-device-info';
// import { getImageUrl } from '../../../Constants/Urls';
import { IMAGE_URl } from '../../../Constants/Urls';
import CountryPicker from "react-native-country-picker-modal";
import { getAllInfoByISO } from '../../../Utils/CurrencyPicker'
import { useIsFocused } from '@react-navigation/native';


const optionsArray = [
    { id: '1', value: Titles.offerHistory, navKey: Constants.TradeHistory, image: ImagePath.tradeHistory },
    { id: '2', value: Titles.support, navKey: Constants.Support, image: ImagePath.support },
    { id: '3', value: Titles.currency_preference, navKey: '', image: ImagePath.currencyPrefer },
    { id: '4', value: Titles.Notifications, navKey: Constants.Notifications, image: ImagePath.notification },
    { id: '5', value: Titles.How_it_Works, navKey: Constants.How_It_Works, image: ImagePath.howItWorks },
    { id: '6', value: Titles.F_A_Q, navKey: Constants.FAQ, image: ImagePath.faq },
    { id: '7', value: Titles.deleteAccount, navKey: '', image: ImagePath.deleteAccount },
    { id: '8', value: Titles.logout, navKey: '', image: ImagePath.settings },

];

// create a component
const Account = ({ navigation }) => {
    const profileDetail = useSelector((state) => state?.auth?.userDetail)

    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // const [countryCode, setCountryCode] = useState(profileDetail?.country);
    const [isVisible, setIsVisible] = useState(false)
    const preferedCountries = [Localize.countryCode]
    const countryCode = profileDetail?.country
    const systemVersion = DeviceInfo.getVersion()
    const buildNo = DeviceInfo.getBuildNumber()
    const isFocused = useIsFocused();


    console.log("user account profile useSelector data is ", profileDetail)
    console.log("user Localize.countryCode Localize.countryCode Localize.countryCode ", Localize.country)

    useEffect(() => {
        Actions.getNotificationsCount()
        fetchUserData()
    }, [isFocused]);
    async function fetchUserData() {
        setLoading(true);
        Actions.userProfileAction()
            .then((res) => {
                console.log("user account Api profile response is >>>> ", res, ">>>>>")
                //  showAlertMessage(res.message,alertType = success)
                setLoading(false);
            })
            .catch((error) => {
                console.log("user account profil error is >>>>", error, "<<<<<");
                showAlertMessage(error?.error, alertType = danger)
                setLoading(false);
            });
    }
    function onpressEditProfile() {
        _onMoveToNextScreen(navigation, Constants.editProfile)
    }
    const onSelectCountry = async (cntry) => {
        setIsVisible(false)


        await updateCountry(cntry)

    }
    const updateCountry = async (cntry) => {
        console.log('onSelectCountryonSelectCountryonSelectCountry:----', cntry.cca2);
        const cCode = cntry.cca2
        const cuurency = await getAllInfoByISO(cCode)
        if (!cuurency?.symbol || !cuurency?.iso || !cuurency?.currency) {
            showAlertMessage('Country not found')
            return
        }
        console.log('updateCountry updateCountry cuurency:--', cuurency);
        setLoading(true);
        const payload = {
            currency_symbol: cuurency?.symbol,
            currency_name: cuurency?.currency,
            country: cuurency?.iso
        }
        console.log('updateCountry updateCountry payload : ----', payload);
        await Actions.updateUserCountry(payload)
            .then(async (res) => {
                console.log("user updateCountry response is >>>> ", res, ">>>>>")
                const dly = await delayed()
                await fetchUserData()
                setLoading(false);

            })
            .catch((error) => {
                console.log("user updateCountryl error is >>>>", error, "<<<<<");
                showAlertMessage(error?.error, alertType = danger)
                setLoading(false);
            });
    }
    const userLogout = () => {
        console.log("logout success res")
        setShowModal(false)
        setLoading(true);
        const query = `?userId=${profileDetail?._id}`

        Actions.logoutAction(query)
            .then((res) => {
                console.log(res, "logout success res")
                showAlertMessage(res.message, alertType = success)
                setLoading(false);
            })
            .catch((error) => {
                console.log("catch error in logout", error);
                showAlertMessage(error?.error, alertType = danger)
                setLoading(false);
            });
    }
    const confirmDeleAccount = () => {
        closeDeleteAlert()
        deleteUserAccount()
    }
    const deleteUserAccount = () => {
        console.log("logout success res")
        setLoading(true);
        // const query = `?userId=${profileDetail?._id}`

        Actions.deleteProfileAction()
            .then((res) => {
                console.log(res, "logout deleteUserAccount res")
                showAlertMessage(res.message, alertType = success)
                setLoading(false);
            })
            .catch((error) => {
                console.log("catch error in deleteUserAccount", error);
                showAlertMessage(error?.error, alertType = danger)
                setLoading(false);
            });
    }

    const onPressListItem = (item) => {
        //
        console.log("item detail is ", item)

        if (item.value == Titles.logout) {
            setShowModal(true)
        } else if (item.value == Titles.deleteAccount) {
            setShowDeleteModal(true)
        }
        else {
            navigation.navigate(item.navKey)
        }

    }


    function UserProfileDetail() {
        return (
            <View style={styles.userProfileContainer} >
                <Components.LoaderImage
                    imageUrl={IMAGE_URl + ((profileDetail?.profilePic) ? profileDetail?.profilePic : '')}
                    style={styles.userImage}
                    resizeMode={ImageEnum.cover}
                />

                <View style={styles.userNameContainr}>
                    <View>
                        <Pressable
                            android_ripple={{ color: Colors.selectedBg }}
                            onLongPress={() => copyText(profileDetail?.username)} >
                            <Text style={{ ...TextStyles.semibold }}>{`${profileDetail?.username}`}</Text>

                        </Pressable>
                        <Text style={{ ...TextStyles.semibold, color: Colors.lightGreyTxt }}>{`${profileDetail?.firstName} ${profileDetail?.lastName}`}</Text>
                    </View>
                    <TouchableHighlight
                        style={styles.btnEdit}
                        suppressHighlighting={true}
                        onPress={() => onpressEditProfile()}
                    >
                        <Text style={{ ...TextStyles.small, ...styles.editText }}>{Titles.editProfile}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
    const ItemView = ({ item }) => {

        if (item.value === Titles.currency_preference) {
            return (
                <TouchableHighlight
                    style={{ paddingVertical: moderateScale(5), paddingHorizontal: moderateScale(20), }}
                    underlayColor={Colors.selectedBg}
                    onPress={() => setIsVisible(true)}
                >
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.itemView}>
                            <Image style={styles.itemIcon} source={item.image} />
                            <Text style={TextStyles.semibold}>{item.value}</Text>
                        </View>


                        <Text style={TextStyles.regular}>{profileDetail?.country}</Text>
                    </View>
                </TouchableHighlight>
            )

        }
        else if (item.value === Titles.version) {
            return (
                <View
                    style={{ paddingVertical: moderateScale(5), paddingHorizontal: moderateScale(20), }}
                >
                    <View style={{ ...styles.itemView, marginLeft: 50, justifyContent: 'space-between', alignItems: "center", }}>
                        <Text style={{ ...TextStyles.semibold }}>{item.value}</Text>
                        <Text style={{ ...TextStyles.semibold, color: Colors.tintColor }}> {`${systemVersion} (${buildNo})`}</Text>
                    </View>
                </View>
            )
        }

        else {
            return (
                <TouchableHighlight
                    style={{ paddingVertical: moderateScale(5), paddingHorizontal: moderateScale(20), }}
                    underlayColor={Colors.selectedBg}
                    onPress={() => onPressListItem(item)}
                >
                    <View style={styles.itemView}>
                        <Image style={styles.itemIcon} source={item.image} />
                        <Text style={TextStyles.semibold}>{item.value}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }
    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    const closeDeleteAlert = () => {
        setShowDeleteModal(false)
        return true
    }
    const ItemSeparatorView = () => {
        return (
            // FlatList Item Separatorcd
            <View
                style={{
                    height: 10,
                    width: '100%',
                }}
            />
        );
    };

    return (
        <>

            <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_White }}>
                <Components.CustomPopUp
                    onHardwareBackPress={closeAlert}
                    onClickTouchOutside={closeAlert}
                    scaleAnimationDialogAlert={showModal}
                    HeaderTitle={Alerts.ALLERT}
                    AlertMessageTitle={Alerts.WANT_TO_LOGOUT}
                    leftBtnText={Titles.Cancel}
                    rightBtnText={Titles.logout}
                    onPressLeftBtn={closeAlert}
                    onPressRightBtn={userLogout}
                />
                <Components.DeleteAccountPopUp
                    onHardwareBackPress={closeDeleteAlert}
                    onClickTouchOutside={closeDeleteAlert}
                    scaleAnimationDialogAlert={showDeleteModal}
                    HeaderTitle={Alerts.ALLERT}
                    HeadTitleColor={Colors.text_red_dark}
                    AlertMessageTitle={Alerts.WANT_TO_DELETE_ACCOUNT}
                    leftBtnText={Titles.Cancel}
                    rightBtnText={Titles.delete}
                    onPressLeftBtn={closeDeleteAlert}
                    onPressRightBtn={confirmDeleAccount}
                />
                <CountryPicker
                    visible={isVisible}
                    withFlag={true}
                    withFlagButton={false}
                    onSelect={(country) =>
                        onSelectCountry(country)
                    }
                    withModal={true}
                    onClose={() => setIsVisible(false)}
                    withEmoji={false}
                    countryCode={countryCode}
                    withCountryNameButton={false}
                    preferredCountries={preferedCountries}
                    withFilter
                />
                <View style={styles.container}>
                    {/* <Text>Account</Text> */}
                    {/* Mark:–- user Profile */}
                    <View style={styles.innerContainer}>
                        <UserProfileDetail />
                        <View style={{ backgroundColor: Colors.seprator,height:1.2,marginTop:moderateScale(20)}} />
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: 5, flex: 1 }}
                            data={optionsArray}
                            // ListHeaderComponent={HeaderView}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                            keyExtractor={item => item.id}
                        />

                        <Text style={{ ...TextStyles.medium, alignSelf: 'center', color: Colors.darkGrayTxt, fontSize: textScale(15) }}> {`V${systemVersion} (${buildNo})`}</Text>
                    </View>
                </View>


            </SafeAreaView>
            {loading && <CustomLoader />}
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: Colors.app_White,
    },
    innerContainer: {
        // marginHorizontal: moderateScale(20),
        flex: 1,
        marginBottom:moderateScale(10)
    },
    userProfileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: moderateScale(25),
        paddingHorizontal: moderateScale(20)
    },
    userNameContainr: {
        // justifyContent:'space-between',
        gap: 10,
    },
    userImage: {
        height: moderateScale(85),
        width: moderateScale(80),
        borderRadius: 6,
    },
    userName: {},
    btnEdit: {
        alignItems: 'center',
        backgroundColor: Colors.app_Black,
        borderRadius: 100,
        width: moderateScale(95)
    },
    editText: {
        paddingVertical: moderateScaleVertical(5),
        color: Colors.text_White,
        fontSize: 13,
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    itemIcon: {
        height: moderateScale(35),
        width: moderateScale(35),
        borderRadius: 100,
        // backgroundColor:Colors.blackOpacity,
        resizeMode: 'cover',
    },
    itemLabel: {},
});

//make this component available to the app
export default Account;
