//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Components from "../../../Components/indexx"
import Colors from '../../../Colors/Colors';
import { moderateScale, moderateScaleVertical, textScale } from '../../../Styles/responsiveSize';
import { Alerts, AppFonts, Constants, En, Titles } from '../../../Constants';
import { TextStyles } from '../../../Styles/ComnStyle';
import Actions from '../../../Redux/Actions';
import { useSelector } from 'react-redux';
import { calculateSellingCoinsQty, currencySymbol, formatNumberToFixed, getCountryCurrencyCountryCode, showAlertMessage, warning, } from '../../../Utils/helperFunctions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const TitleMessage = ({coinQty,offerDetail,ammount,currencySymbol,adminMarginQty,getAdminMargin,finalPrice}) => {
    return (
        <>
            <Text style={{ ...TextStyles.small,textAlign:'center' }}>
                You are starting the deal of <Text style={styles.higlighText}> {coinQty ? formatNumberToFixed(coinQty).toString() : 0} {offerDetail?.symbol?.toUpperCase()}</Text> at price of <Text style={styles.higlighText}> {currencySymbol} {ammount}</Text>.
                After adding <Text style={styles.higlighText}> {getAdminMargin ? formatNumberToFixed(getAdminMargin): 0} {offerDetail?.symbol?.toUpperCase()}</Text> of platform charges.You bought <Text style={styles.higlighText}> {finalPrice ? formatNumberToFixed(finalPrice) : 0 } {offerDetail?.symbol?.toUpperCase()}</Text> .
            </Text>
        </>

    )
}

// create a component
const BuyDeal = ({ navigation, route }) => {
    const lastScreenData = route?.params
    const [ammount, setAmmount] = useState("")
    const [coinQty, setCoinQty] = useState("")
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [isBuyFullDeal, setIsBuyFullDeal] = useState(false);
    const [showWaringModal, setShowWaringModal] = useState(false)

    const userDetail = lastScreenData?.userDetail
    const offerDetail = lastScreenData?.offerDetail
    const myProfileDetail = lastScreenData?.myProfileDetail

    const walletReducer = useSelector((state) => state?.wallet)
    const coinDetails = walletReducer?.coinsDetails

    const coin = offerDetail?.coin
    const curretCoin = coin === 'USDT' ? 'tether' : coin?.toLowerCase()
    const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
    const marketPrice = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? selectLiveCoin[offerDetail?.currency_name?.toLowerCase()] : selectLiveCoin['usd']
    const currencySymbol = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? offerDetail?.currency_symbol : '$'
    const adminDetails = useSelector((state) => state?.wallet?.adminDetails)

    const selectedCoinAdmin = adminDetails?.profits.find((item)=>item?.coin_type == offerDetail?.coin)
    const adminMarginPercent = selectedCoinAdmin?.buyer
    console.log('selectedCoinAdmin are : ---',selectedCoinAdmin);//seller


// const getAdminMargin = formatNumberToFixed((formatNumberToFixed(offerDetail?.maxQuantity) /100)*10)
const getAdminMargin = formatNumberToFixed(coinQty/ammount*(adminMarginPercent/100 * ammount))



const [isEnable,setIsEnable] = useState(false)
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    useEffect(() => {
        updateAmount()
    }, [coinDetails])
    useEffect(() => {
        updateAmount()
    }, [])
    const updateAmount = () => {
        if (offerDetail?.sell_at_mp) {
            const minPrice = ((((marketPrice * offerDetail?.minQuantity) / 100) * offerDetail.percentage) + (marketPrice * offerDetail?.minQuantity))
            const maxPrice = ((((marketPrice * offerDetail?.lockedQuantity) / 100) * offerDetail.percentage) + (marketPrice * offerDetail?.lockedQuantity))

            // const minPriceWS = ((((marketPrice * offerDetail?.minQuantity) / 100) * offerDetail.percentage) + (marketPrice * offerDetail?.minQuantity))
            // const maxPriceWS = ((((marketPrice * getAdminMargin) / 100) * offerDetail.percentage) + (marketPrice * offerDetail?.maxQuantity))


            setMinPrice(minPrice)
            setMaxPrice(maxPrice)
        } else {
            const minPrice = offerDetail?.maxAmount
            const maxPrice = offerDetail?.minAmount
            setMinPrice(minPrice)
            setMaxPrice(maxPrice)
        }
    }
    const toggleSwitch = () => {
        setIsBuyFullDeal(previousState => !previousState);
        // const amnt = maxPrice ? parseFloat(maxPrice).toFixed(2).toString() : 0
        // setAmmount(amnt)
        const amt = formatNumberToFixed(maxPrice,2,true)
        
        onchangeAmmount(amt)
        setCoinQty((offerDetail?.maxQuantity ? formatNumberToFixed(offerDetail?.maxQuantity):0))
    }


    const onPressBuyDeal = () => {
        // withdrawFromPlatForm()
        // setShowModal(true)
        // return
        const qty_nd_Admin = formatNumberToFixed(coinQty,6,true) + formatNumberToFixed(getAdminMargin,6,true)
        if (!ammount) {
            showAlertMessage('Please enter amount', warning)
        } else if (formatNumberToFixed(ammount,2,true) < formatNumberToFixed(minPrice,2,true)) {
            showAlertMessage(`Amount not be less then Rs ${formatNumberToFixed(minPrice,2)}`, warning)
        } else if (formatNumberToFixed(ammount,2,true) > formatNumberToFixed(maxPrice,2,true)) {
            showAlertMessage(`Amount not be geater then Rs ${formatNumberToFixed(maxPrice,2)}`, warning)
        } else if ( formatNumberToFixed(qty_nd_Admin,6,true) > formatNumberToFixed(offerDetail?.maxQuantity,6,true)) {
            showAlertMessage(`Seller have not enough balance to sell please try after some time`, warning)
        }

        else {
            setShowModal(true)
        }
    }

    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    const onPressPopupRightBtn = async () => {
        closeAlert()
        setShowWaringModal(true)
       

    }
   
    const closeWaringAlert = () => {
        setShowWaringModal(false)
        return true
    }
    const confirmBuyDeal = () => {
        closeAlert()
        closeWaringAlert()
        sendDefaultMessage()
    }


    const onchangeAmmount = (val) => {
        setAmmount(formatNumberToFixed(val))
        const singlCoin = parseFloat(maxPrice ?? 0) / parseFloat(offerDetail?.lockedQuantity ?? 0)
        const accToSpQty = parseFloat(val) / parseFloat(singlCoin)
        setCoinQty(accToSpQty ? formatNumberToFixed(accToSpQty) : 0)
        if (val > formatNumberToFixed(maxPrice,2,true)) {
            setError(`You only have to buy maximum ${currencySymbol} ${(maxPrice ? formatNumberToFixed(maxPrice,2) : 0)} coins`)
            setIsEnable(false)
        } else if (val < formatNumberToFixed(minPrice,2,true)) {
            setError(`You only have to buy minimum ${currencySymbol} ${(minPrice ? formatNumberToFixed(minPrice,2) : 0)} coins`)
            setIsEnable(false)

        } else {
            setError('')
            setIsEnable(true)

        }
    }

    const validateField = async () => {
        // showAlertMessage('validateField')
        console.log('amount amount', ammount);
        console.log('maxPrice maxPrice', maxPrice);
        console.log('minPrice minPrice', minPrice);
        if (parseFloat(ammount) > parseFloat(maxPrice)) {
            setError(`You only have to buy maximum ${currencySymbol} ${(maxPrice ? formatNumberToFixed(maxPrice,2)  : 0).toString()} coins`)
        } else if (parseFloat(ammount) < parseFloat(minPrice)) {
            setError(`You only have to buy minimum ${currencySymbol} ${(minPrice ? formatNumberToFixed(minPrice,2) : 0).toString()} coins`)
        } else {
            setError('')
        }
    }
    // console.log('lastScreenData in Transfer is : ---', lastScreenData)
    const sendDefaultMessage = async () => {
        // setLoading(true)
        closeAlert()
        const data = {
            message: '',//defaultMessage(offerDetail, offerDetail?.user_details[0]), //defaultMessage({ offerDetail}),
            offerId: offerDetail?._id,
            receiver: userDetail?._id,
            sender: myProfileDetail._id,
            message_type: null,
            quantity: Number(formatNumberToFixed(coinQty)),
            amount: Number(formatNumberToFixed(ammount,2))
        }
        // sender,receiver,offerId,message,message_type,quantity,amount

        console.log("sendDefaultMessage is : --", data)
        await Actions.sendDefaultMessage(data).then((res) => {
            // setLoading(false)
            console.log("res while sendDefaultMessage is : --", res)
            const msg = res?.message ? res.message : res.error
            let payLoadParams = {
                chatExchangeId: res?.data?.chatExchangeId,
                offer_id: offerDetail?._id,
                receiver_id: userDetail?._id
            }
            navigation.navigate(Constants.chat, payLoadParams)
            onchangeAmmount('')
            setAmmount('')
            setCoinQty('')
            setError('')
            setIsEnable(false)
            // showAlertMessage(msg,alertType = success)
        }).catch((err) => {
            // setLoading(false)
            console.log("error from sendDefaultMessage is : --", err)
            const msg = err?.message ? err.message : err.error
            showAlertMessage(msg)
        })
    }
  
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.app_Bg} barStyle={'dark-content'} />
            <KeyboardAwareScrollView>
                <Components.CustomPopUp
                    onHardwareBackPress={closeAlert}
                    onClickTouchOutside={closeAlert}
                    scaleAnimationDialogAlert={showModal}
                    HeaderTitle={Alerts.ALLERT}
                // AlertMessageTitle={'Are you sure you want to buy this deal'}

                    renderSubtitle={<TitleMessage coinQty={coinQty} offerDetail={offerDetail} ammount={ammount} currencySymbol ={currencySymbol} getAdminMargin={formatNumberToFixed(getAdminMargin)} finalPrice={formatNumberToFixed(formatNumberToFixed(coinQty)-formatNumberToFixed(getAdminMargin))} />}
                    // AlertMessageTitle={}
                    leftBtnText={Titles.No}
                    rightBtnText={Titles.Yes}
                    onPressLeftBtn={closeAlert}
                    onPressRightBtn={async () => await onPressPopupRightBtn()}
                />
                   <Components.WaringMessagePopUp
                    onHardwareBackPress={closeWaringAlert}
                    onClickTouchOutside={closeWaringAlert}
                    scaleAnimationDialogAlert={showWaringModal}
                    HeaderTitle={Alerts.ALLERT}
                    HeadTitleColor={Colors.text_red_dark}
                    AlertMessageTitle={Alerts.WARNING_BEFORE_START_TRADE}
                    leftBtnText={Titles.Cancel}
                    rightBtnText={Titles.ok}
                    onPressLeftBtn={closeWaringAlert}
                    onPressRightBtn={confirmBuyDeal}
                />
                <View style={styles.container}>

                    {/* MARK  : --   Header */}
                    <Components.BackBtnHeader
                        navigation={navigation}
                        isSowText={false}
                        centerheaderTitle={`${Titles.Buy} ${offerDetail?.coin}`}//lastScreenData?.name
                    />
                    {/* MARK  : --   inner container */}

                    <View style={styles.innerContainer}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(10) }}>
                            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader, }}>{"Enter Amount"}</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', gap: Platform.OS == 'ios' ? moderateScale(5) : 0 }}>
                                <Components.GradientText style={{ ...TextStyles.medium, ...styles.fieldHeader, }}>{"Buy complete order"}</Components.GradientText>
                                <Switch
                                    style={{ alignSelf: 'center', marginBottom: 0, backgroundColor: Colors.transparent }}
                                    trackColor={{ false: '#767577', true: Colors.gradiantDwn }}
                                    thumbColor={isBuyFullDeal ? Colors.app_White : Colors.app_White}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isBuyFullDeal}
                                />
                            </View>

                        </View>

                        {/* <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{"Enter Ammount"}</Text> */}
                        <Components.CustomTextInput
                            innerContainerStyle={styles.textInputInnerContainer}
                            textStyle={{ color: isBuyFullDeal ? Colors.darkSliver : Colors.text_Black }}
                            value={ammount}
                            leftTextStyle={{ paddingRight: 0, borderRightWidth: 0, color: !ammount ? Colors.placeholder : isBuyFullDeal ? Colors.darkSliver : Colors.text_Black, fontFamily: AppFonts.regular }}
                            keyboardType={'decimal-pad'}
                            placeholder='Enter Amount'
                            maxLength={15}
                            editable={!isBuyFullDeal}
                            isshowLeftImg={false}
                            onChangeText={(val) => onchangeAmmount(val)}
                            leftText={currencySymbol}
                            onFocus={validateField}
                            onBlur={validateField}
                        />

                        <Text style={{ ...TextStyles.medium, ...styles.orderDiscript }}>{`${"Equivalent:"} ${coinQty ? formatNumberToFixed(coinQty).toString() : 0} ${offerDetail?.symbol?.toUpperCase()}`}</Text>
                        {error &&
                            <Text style={{ ...TextStyles.medium, ...styles.error, color: Colors.text_red_dark }}>{error}</Text>
                        }
                        <Components.CustomButton title={Titles.Buy}
                            containerStyle={styles.customButton}
                            isdisable={!isEnable}
                            onPress={() => onPressBuyDeal()} />
                        <View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
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
        paddingVertical: moderateScaleVertical(30),
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
        // marginBottom: moderateScale(10),
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
    },
    orderDiscript: {
        color: Colors.text_green,
        fontSize: textScale(13),
        marginRight: 0,
        textAlign: 'right',
        marginTop: moderateScale(5)
    }, error: {
        color: Colors.text_red_dark,
        fontSize: 13,
        marginRight: 0,
        // textAlign: 'right',
        marginBottom: moderateScale(20),
        marginTop: moderateScale(5)
    }, higlighText: {
        ...TextStyles.small,
        fontFamily: AppFonts.bold,
        color: Colors.text_lightBlack,
        fontSize: textScale(14)
    }, 
});

//make this component available to the app
export default BuyDeal;


