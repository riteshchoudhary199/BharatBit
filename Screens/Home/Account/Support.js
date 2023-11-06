//import liraries
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../../Colors/Colors';
import * as Components from "../../../Components/indexx";
import { Alerts, En, Titles } from '../../../Constants';
import { CommonStyles, TextStyles } from '../../../Styles/ComnStyle';
import { moderateScale, moderateScaleVertical, textScale } from '../../../Styles/responsiveSize';
import { danger, showAlertMessage, success, warning,delayed } from '../../../Utils/helperFunctions';
import Actions from '../../../Redux/Actions';
import NavigationService from '../../../Services/NavigationService';
import { useSelector } from 'react-redux';


// create a component
const Support = ({ navigation, route }) => {
    const lastScreenData = route?.params
    const [loading, setLoading] = useState(false)
    const [disputeType, setDisputeType] = useState(undefined)
    const [discription, setDiscription] = useState('')
    const [showModal, setShowModal] = useState(false)
    // const [disputeTypeArr, setDisputeTypeArr] = useState([])
    // const disputeTypeArr = [{ label: 'Payment Issue', value: 'Payment Issue' },
    // { label: 'Coins Issue', value: 'Coins Issue' },
    // { label: 'Others', value: 'Others' }]
    const homeRedux = useSelector((state) => state?.homeReducer)
    // const allCoinsList = homeRedux?.allCoinsList
    const disputeTypeArr = homeRedux?.supportTypes

    console.log('disputeTypeArr disputeTypeArr: ---',disputeTypeArr);
    const onSelectDropDown = (item) => {
        console.log("selected item is : --- ", item)
        setDisputeType(item)
    }
    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    const onPressConfirm = () => {
        closeAlert()
        sendSupport()

    }
    const onPressSend = () => {
        if (!disputeType) {
            showAlertMessage(Alerts.PLEASE_SELECT_ISSUE_TYPE, warning)
            return
        } else if (!discription) {
            showAlertMessage(Alerts.PLEASE_ENTER_DISCRIPTION, warning)
            return
        } else {
            setShowModal(true)

        }
    }
    useEffect(() => {
        if(disputeTypeArr.length == 0){
            getSupportTitles()
        }
       
    }, [])

    const getSupportTitles = () => {
        setLoading(true);
        Actions.getSupportTypes().then((res) => {
            console.log('respons getHelpAndSupportTitleList is : ---', res)
            // setDisputeTypeArr(res.data?.titles)
            setLoading(false);
            // setDisputeType('')
            // setDiscription('')
            // showAlertMessage(res.message, alertType = success)
            // navigation.goBack()
        }).catch((err) => {
            console.log('error getHelpAndSupportTitleList is : ---', err)
            showAlertMessage(err?.error, alertType = danger)
            setLoading(false);
        })

    }

    const sendSupport = async () => {
        const data = {
            description: disputeType?.title,
            title: discription
        }
        Actions.sendSupportMessage(data).then(async (res) => {
            console.log('respons sendSupportMessage is : ---', res)
            setLoading(false);
            setDisputeType('')
            setDiscription('')
            showAlertMessage(res.message, alertType = success)
            let delayres = await delayed(3000);
            NavigationService.goBack()
        }).catch((err) => {
            console.log('error sendSupportMessage is : ---', err)
            showAlertMessage(err?.error, alertType = danger)
            setLoading(false);
        })
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />
                <Components.CustomPopUp
                    onHardwareBackPress={closeAlert}
                    onClickTouchOutside={closeAlert}
                    scaleAnimationDialogAlert={showModal}
                    HeaderTitle={En.Support}
                    AlertMessageTitle={`Have you need to support on ${disputeType?.value}`}
                    leftBtnText={Titles.Decline}
                    rightBtnText={Titles.Confirm}
                    onPressLeftBtn={closeAlert}
                    onPressRightBtn={onPressConfirm}
                />
                <View style={styles.container}>

                    {/* MARK  : --   Header */}
                    <Components.BackBtnHeader
                        leftBtnTitle={En.Support}
                        navigation={navigation}
                    />

                    {/* MARK  : --   inner container */}
                    <View style={styles.innerContainer}>
                        <Components.DropDownField
                            data={disputeTypeArr}
                            defaultValue={disputeType}
                            placeholderText={En.Support_Type}
                            labelHeaderText={En.Whats_Problm_can_we_help}
                            headerTextStyle={{ ...styles.subtitleStyle, marginBottom: moderateScale(5), }}
                            containerStyle={{
                                marginBottom: moderateScale(15)
                            }}
                            onSelecton={onSelectDropDown}
                            isSearch={false}
                            dropdownStyle={{ ...styles.textInputInnerContainer, }}
                        />
                        <Text
                            style={{ ...TextStyles.medium, ...styles.subtitleStyle, marginBottom: moderateScale(5) }}>
                            {En.Description}
                        </Text>
                        <View
                            style={{ ...styles.discriptionContainer, marginBottom: moderateScale(15) }}
                        >
                            <TextInput
                                style={{ ...CommonStyles.textInput, flex: 1, }}
                                textAlignVertical='top'
                                multiline
                                placeholder={En.enterMessage}
                                placeholderTextColor={Colors.darkGrayTxt}
                                value={discription}
                                onChangeText={(val) => setDiscription(val)}
                            />
                        </View>

                        <Components.CustomButton title={Titles.Send}
                            containerStyle={styles.customButton}
                            onPress={() => onPressSend()} />
                        <View>
                        </View>
                    </View>

                </View>
                {/* <WalletConnectModal
                    projectId={keys.WCProjID}
                    providerMetadata={providerMetadata}
                    sessionParams={sessionParams}
                /> */}
            </SafeAreaView>
            {loading && <Components.CustomLoader />}
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
        flex: 1,
        // backgroundColor: Colors.app_Red,
        marginTop: moderateScaleVertical(20),
        marginHorizontal: moderateScale(20)
    },
    amountfromWalletContainer: {
        marginTop: moderateScaleVertical(5)
    },
    textInput: {
        marginBottom: moderateScale(0),
        marginTop: moderateScaleVertical(20),
    }, fieldHeader: {
        color: Colors.darkGrayTxt,
        fontSize: textScale(14),
        marginBottom: moderateScale(10),
    }, textInputInnerContainer: {
        backgroundColor: Colors.app_White,
        // paddingVertical: moderateScale(18),
        borderWidth: 1.2,
        borderRadius: 6
    },
    customButton: {
        marginTop: moderateScale(50),
        height: moderateScale(55),
        marginHorizontal: moderateScale(15)
    }, subtitleStyle: {
        color: 'rgba(101, 101, 101, 0.5)',
        // marginTop: moderateScaleVertical(15),
        // marginBottom: moderateScaleVertical(20),
        fontSize: moderateScale(15)
    }, discriptionContainer: {
        backgroundColor: Colors.app_White, borderRadius: 10,
        borderColor: Colors.border_textfld_dark, borderWidth: 1.2,
        height: moderateScale(150), paddingHorizontal: moderateScale(0), paddingVertical: moderateScaleVertical(0)
    },
});

//make this component available to the app
export default Support;
