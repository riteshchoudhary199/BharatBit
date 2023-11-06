//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Components from "../../../Components/indexx"
import Colors from '../../../Colors/Colors';
import { moderateScale, moderateScaleVertical, textScale } from '../../../Styles/responsiveSize';
import { Alerts, En, Titles } from '../../../Constants';
import { TextStyles } from '../../../Styles/ComnStyle';
import Actions from '../../../Redux/Actions';
import { danger, formatNumberToFixed, showAlertMessage, success } from '../../../Utils/helperFunctions';
import { keys } from '../../../Constants/Privates';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigationService from '../../../Services/NavigationService';


export const TextInputVw = ({ textValue, onChangeText = () => { }
    , placeholder = En.Enter_Manually, headerText, bottomText, containerStyle, keyboardType ,maxLength}) => {
    return (
        <View style={{ ...styles.textInput, containerStyle }}>
            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{headerText}</Text>
            <Components.CustomTextInput
                innerContainerStyle={styles.textInputInnerContainer}
                value={textValue}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                isshowLeftImg={false}
                maxLength={maxLength}
            />
            {
                bottomText &&
                <Text style={{ ...TextStyles.medium, ...styles.orderDiscript }}>{bottomText}</Text>
            }
        </View>
    )

}

// create a component
const Withdraw = ({ navigation, route }) => {
    const lastScreenData = route?.params
    const [walletAddress, setwalletAddress] = useState("")
    const [adminWalletAddress, setAdminWalletAddress] = useState("")
    const [adminProfitPercent, setAdminProfitPercent] = useState("")
    const [finalCoinQty, setFinalCoinQty] = useState("")

    const [coinQty, setCoinQty] = useState("")

    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const coinDetailsArr = useSelector((state) => state?.auth?.coinDetails)
    let selectedCoin = coinDetailsArr?.find(data => data?.name == lastScreenData?.name)

    const adminDetails = useSelector((state) => state?.wallet?.adminDetails)
    const selectedCoinAdmin = adminDetails?.profits.find((item)=>item?.coin_type == lastScreenData?.name)
    console.log('selectedCoinAdmin are : ---',selectedCoinAdmin);
const coinSymbol = selectedCoin?.name == 'Bitcoin'?'BTC' : selectedCoin?.name == 'Ethereum' ?'ETH': selectedCoin?.name == 'USDT'?'USDT':''

console.log('adminDetails are : ---',adminDetails);
    const onPressTransfer = () => {
        if (walletAddress == "") {
            showAlertMessage("Please fill enter wallet address")
        } else if (walletAddress.length < 17) {
            showAlertMessage("Please enter valid wallet address")
        } else if (coinQty == "") {
            showAlertMessage("Please enter amount")
        } else if (Number(coinQty) <= 0) {

            showAlertMessage("Please enter valid Qty")
        }
        else if (Number(coinQty) > Number(selectedCoin?.remainingBalance)  && Number(finalCoinQty) > 0) {

            showAlertMessage("Insufficient balance in your account")
        }

        else {
            Keyboard.dismiss()
            setShowModal(true)

        }
    }
    const onPressConfirm = () => {
        closeAlert()
        withdrawFromPlatForm()
    }
    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    useEffect(()=>{
        const name = lastScreenData?.name ? lastScreenData?.name?.toLowerCase(): ''
        setAdminWalletAddress(adminDetails[name])
    },[adminDetails])

    useEffect(() => {
        Actions.getAdminDetails()
    }, [])

    const getAdminProfit = () => {
        setLoading(true);

        Actions.getAdminWithdrawProfit()
            .then((res) => {
                const data = res?.data?.profits?.withdraw_profit
                console.log("getAdminWithdrawProfit is", data);
                setAdminProfitPercent(data)
                let msg = res?.message;
                console.log("all transaction msg is", msg);
                setLoading(false);
                // showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? success : warning)
            })
            .catch((error) => {
                console.log("catch error in  getAdminWithdrawProfit is :---- ", error);
                setLoading(false);
                showAlertMessage((message = error?.error), (alertType = danger));
            });
    };


    const withdrawFromPlatForm = (data) => {
        if (walletAddress == "") {
            showAlertMessage("Please fill enter wallet address")
        } else if (walletAddress.length < 17) {
            showAlertMessage("Please enter valid wallet address")
        } else if (coinQty == "") {
            showAlertMessage("Please enter amount")
        } else {
            setLoading(true);
            let data = {
                to_wallet: walletAddress,
                quantity: finalCoinQty,
                coin_symbol: lastScreenData?.name,
            }
                // from_wallet: adminWalletAddress,
                // "transaction_hash": "232323"

            Actions.withdraw(data).then((res) => {
                console.log('respons withdraw amount into wallet : ---', res)
                const msg = res.message ? res.message : res.error
                showAlertMessage(msg, alertType = success)
                setLoading(false);
                NavigationService.goBack()
            }).catch((err) => {
                console.log('error withdraw amount into wallet is : ---', err)
                showAlertMessage(err?.error, alertType = danger)
                setLoading(false);
            })
        }
    }

    const onChangeQty = (val) => {
        setCoinQty(val)
        const adminMargin = Number(selectedCoinAdmin?.withdraw) / 100 * Number(val)
        const finalPrice = Number(val) - adminMargin
        setFinalCoinQty((finalPrice ? formatNumberToFixed(finalPrice).toString() : ''))

    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.app_Bg} barStyle={'dark-content'} />
            <Components.CustomPopUp
                onHardwareBackPress={closeAlert}
                onClickTouchOutside={closeAlert}
                scaleAnimationDialogAlert={showModal}
                HeaderTitle={lastScreenData?.type ?? Alerts.ALLERT}
                AlertMessageTitle={`Are you want to withdrow your ${lastScreenData?.name} coins.`}
                leftBtnText={Titles.Decline}
                rightBtnText={Titles.Confirm}
                onPressLeftBtn={closeAlert}
                onPressRightBtn={onPressConfirm}
            />
            <KeyboardAwareScrollView>
                <View style={styles.container}>

                    {/* MARK  : --   Header */}
                    <Components.BackBtnHeader
                        navigation={navigation}
                        isSowText={false}
                        centerheaderTitle={`Withdraw ${lastScreenData?.name}`}//lastScreenData?.name

                    />
                    {/* MARK  : --   inner container */}
                    <View style={styles.innerContainer}>

                        <TextInputVw
                            headerText={`${"Enter"} ${"wallet address"}`}
                            textValue={walletAddress}
                            keyboardType={''}
                            placeholder={'Enter wallet address'}
                            onChangeText={(val) => setwalletAddress(val)}
                        />

                        <TextInputVw
                            headerText={`${"Enter"} ${lastScreenData?.name}`}
                            textValue={coinQty}
                            bottomText={`${En.Available_Amount} ${selectedCoin?.remainingBalance ?? ''} ${coinSymbol.toUpperCase() ?? ''}`}
                            keyboardType={'decimal-pad'}
                            placeholder={`${"Enter"} ${lastScreenData?.name} Qty`}
                            onChangeText={(val) => onChangeQty(val)}
                            maxLength = {16}
                        />
                        <Text style={{ ...TextStyles.small, marginTop: moderateScale(8) }}>{`After ${selectedCoinAdmin?.withdraw ?? '0'}% GAS fees final amount is `}
                            <Text style={{ ...TextStyles.small,}}>{`${(finalCoinQty)?formatNumberToFixed(finalCoinQty):0} ${coinSymbol.toUpperCase() ?? ''}`}</Text>
                        </Text>

                        <Components.CustomButton title={"Withdraw"}
                            containerStyle={styles.customButton}
                            onPress={() => onPressTransfer()} />
                        <View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            {loading && <Components.CustomLoader />}

        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: Colors.app_Bg,
    },
    innerContainer: {
        flex: 1,
        // backgroundColor: Colors.app_Red,
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
        backgroundColor: Colors.bg_textfld_dark,
        // paddingVertical: moderateScale(18),
        borderWidth: 1.2,
        borderRadius: 6
    },
    customButton: {
        marginTop: moderateScale(50),
        height: moderateScale(55),
        marginHorizontal: moderateScale(15)
    }, orderDiscript: {
        color: Colors.text_green,
        fontSize: textScale(13),
        marginRight: 0,
        textAlign: 'right',
        marginTop: moderateScale(5)
    },
});

//make this component available to the app
export default Withdraw;
