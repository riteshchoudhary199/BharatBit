//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Share, Pressable } from 'react-native';
import ImagePath from '../Constants/ImagePath';
import { height, moderateScale, moderateScaleVertical, scale, textScale, width } from '../Styles/responsiveSize';
import Colors from '../Colors/Colors';
import { TextStyles } from '../Styles/ComnStyle';
import GradientText from './GradientText';
import CustomButton from './CustomButton';
import Titles from '../Constants/Titles';
import moment from 'moment';
import { Alerts, Constants, En, Localize } from '../Constants';
import * as Components from "./indexx"
import { IMAGE_URl } from '../Constants/Urls';
import { _onMoveToNextScreen, calcuTotalCounAmunt, currencySymbol, formatNumberToFixed, getCountryCurrencyCountryCode, getPriceInPercent, showAlertMessage, success } from '../Utils/helperFunctions';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Actions from '../Redux/Actions';
import { useSelector } from 'react-redux';
import { defaultMessage } from '../Constants/En';
import socketServices from '../Services/scoketService';


// create a component
const GetOfferComponent = ({ containerStyle, offerDetail, navigation, onPressBuyBtn = () => { } }) => {
    const userDetail = offerDetail?.user_details[0] ?? {}



    let memberSinceDate = moment(userDetail?.createdAt).format('YYYY')//('Do, MMMM YYYY')
    // console.log("user offer Detail  is ", offerDetail)
    let offrCreateDate = moment(offerDetail?.createdAt).format('Do, MMM YYYY')
    const dealHistory = offerDetail?.dealHistory

    const [showModal, setShowModal] = useState(false)
    const walletReducer = useSelector((state) => state?.wallet)
    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    const coinDetails = walletReducer?.coinsDetails


    // const [marketPrice, setMarketPrice] = useState(0)

    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [perCoinPrice,setPerCoinPrice] = useState('')
    // const [currencySymbol, setCurrencySymbol] = useState('')


    const coin = offerDetail?.coin
    const curretCoin = coin === 'USDT' ? 'tether' : coin?.toLowerCase()
    const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
    const marketPrice = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? selectLiveCoin[offerDetail?.currency_name?.toLowerCase()] : selectLiveCoin['usd']
    const currencySymbol = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? offerDetail?.currency_symbol : '$'
    // setMarketPrice(MRP)
    // setCurrencySymbol(symb)

    useEffect(() => {
        calculatePrice()
    }, [coinDetails,offerDetail])

    // useEffect(() => {
    //     console.log("hello there checking render");
    //     calculatePrice()
    // }, [])

    
    const calculatePrice = () => {
        if (offerDetail?.sell_at_mp) {
            // const minInitPrice = parseFloat(marketPrice ?? 0) * parseFloat(offerDetail?.minQuantity ?? 0)
            // const minPercentPrice = parseFloat(minInitPrice) ?? 0 / 100 * parseFloat(offerDetail?.percentage ?? 0)
            // const maxInitPrice = parseFloat(marketPrice ?? 0) * parseFloat(offerDetail?.maxQuantity ?? 0)
            // const maxPercentPrice = parseFloat(maxInitPrice) ?? 0 / 100 * parseFloat(offerDetail?.percentage ?? 0)

            // console.log("\n\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
            const minPrice = ((((marketPrice * offerDetail?.minQuantity) / 100) * Number(offerDetail.percentage)) + (marketPrice * offerDetail?.minQuantity))
            const maxPrice = ((((marketPrice * offerDetail?.lockedQuantity) / 100) * Number(offerDetail.percentage)) + (marketPrice * offerDetail?.lockedQuantity))
            const oneCoinPrice = (maxPrice / offerDetail?.maxQuantity)
            setPerCoinPrice(oneCoinPrice)
            setMinPrice(minPrice)
            setMaxPrice(maxPrice)

        } else {
            const minPrice = offerDetail?.maxAmount
            const maxPrice = offerDetail?.minAmount
            const oneCoinPrice = (maxPrice / offerDetail?.maxQuantity)
            setPerCoinPrice(oneCoinPrice)
            setMinPrice(minPrice)
            setMaxPrice(maxPrice)
        }
    }
    // console.log('offr detail is ;------', offerDetail)

    const btnTitle = Titles.Buy//(dealHistory?.chatHistory && dealHistory?.isTimeOut) ? 'Restart' : dealHistory?.chatHistory && !dealHistory?.isTimeOut ? 'canceled' : Titles.Buy
    const onPressBuy = async () => {
        // _onMoveToNextScreen(navigation,Constants.chat,userDetail)
        // await sendDefaultMessage()
        //         "chatHistory":true,
        // "isTimeOut":true
        onCellSelection()
        // if (offerDetail?.sell_partially == true) {
        //     const payLoad = { userDetail: userDetail, offerDetail: offerDetail, myProfileDetail: myProfileDetail }

        //     navigation.navigate(Constants.BuyDeal, payLoad)
        //     return
        // } else if (btnTitle === 'canceled') {
        //     showAlertMessage("You already canceled this offer")

        // } else {
        //     setShowModal(true)
        // }
    }

    const shareDeal = async () => {
        try {
            const result = await Share.share({
                title: 'App link',
                message: 'Please install this app and stay safe , AppLink :https://bharatbit.zip2box.com',
                url: 'https://bharatbit.zip2box.com'

            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };



    const onCellSelection = () => {
        // _onMoveToNextScreen(navigation,Constants.chat,userDetail)
        let payLoadParams = {
            offerId: offerDetail?._id,
        }
        navigation.navigate(Constants.OfferDetail, payLoadParams)
        // onPressBuyBtn
    }
    const onPressPopupRightBtn = async () => {
        if (btnTitle === 'Restart') {
            reInitiateDeal()
        } else {
            await sendDefaultMessage()
        }

    }

    const reInitiateDeal = () => {
        // showAlertMessage('reInitiateDeal reInitiateDeal reInitiateDeal')
        closeAlert()
        if (!dealHistory?.chatExchangeId && !offerDetail?.userId) {
            showAlertMessage('No chat Id or bued id found')
            return
        }
        const data = {
            chatexchangeId: dealHistory?.chatExchangeId,
            userId: offerDetail?.userId
        }
        console.log("reInitiateDeal reInitiateDeal reInitiateDeal");
        socketServices.socket.emit("initiateDeal", data, function (response) {
            console.log(response, "initiateDeal emit message sent ");
            let payLoadParams = {
                'offer_id': offerDetail?._id,
                'receiver_id': userDetail?._id
            }


            navigation.navigate(Constants.chat, payLoadParams)
            // setIsTimeOut(undefined)
            // const result = response?.result
            // const detail = {...statusDetails,isTimeOut:new Date()}
            // statusDetails(detail)
            // Alert.alert(JSON.stringify(response))
        });
        // socketServices.emit('initiateDeal')
        // sendSystemMessageToSocket('initiateDeal', 'Your deal has been restarted by Seller')

    }
    const sendDefaultMessage = async () => {
        // setLoading(true)
        closeAlert()
        const data = {
            message: '',//defaultMessage(offerDetail, offerDetail?.user_details[0]), //defaultMessage({ offerDetail}),
            offerId: offerDetail?._id,
            receiver: userDetail?._id ,
            sender: myProfileDetail._id,
            message_type: '',
            quantity: offerDetail?.maxQuantity,
            amount: maxPrice
        }
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
            // showAlertMessage(msg,alertType = success)
        }).catch((err) => {
            // setLoading(false)
            console.log("error from sendDefaultMessage is : --", err)
            const msg = err?.message ? err.message : err.error
            showAlertMessage(msg)
        })
    }

    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    return (
        <View style={{ ...styles.container, ...containerStyle, }}>
            <View style={styles.innerContainer} >
                <Components.CustomPopUp
                    onHardwareBackPress={closeAlert}
                    onClickTouchOutside={closeAlert}
                    scaleAnimationDialogAlert={showModal}
                    HeaderTitle={Alerts.ALLERT}
                    AlertMessageTitle={Alerts.Are_you_want_to_buy}
                    leftBtnText={Titles.No}
                    rightBtnText={Titles.Yes}
                    onPressLeftBtn={closeAlert}
                    onPressRightBtn={async () => await onPressPopupRightBtn()}
                />

                {/* Row */}
                <TouchableOpacity
                    style={{
                        // borderRadius:10,
                        paddingHorizontal: moderateScale(10),
                        paddingVertical: moderateScale(10)
                    }}
                    activeOpacity={0.8}
                    // underlayColor={Colors.selectedBg}
                    onPress={onCellSelection}
                >
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {/* <Image source={userImage} style={styles.userImage} /> */}
                            <View style={{ flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center' }}>
                                <Components.LoaderImage
                                    imageUrl={IMAGE_URl + ((userDetail?.profilePic) ? userDetail?.profilePic : '')}
                                    indicatorSize='small'
                                    style={styles.userImage}
                                />

                                <View style={{ marginLeft: moderateScale(8) }}>
                                    <GradientText
                                        colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                                        style={{ ...TextStyles.large, ...styles.userName }} >
                                        {/* {userName} */}
                                        {`${userDetail?.firstName || ''} ${userDetail?.lastName || ''}`}
                                    </GradientText>
                                    <Text style={{ ...TextStyles.small, ...styles.userDisc }}>
                                        {/* {`dkjsdj`} */}
                                        {`${En.member_Since} ${memberSinceDate || ""} | ${offerDetail?.country || ''} |`}

                                    </Text>
                                </View>
                            </View>

                            <Pressable
                                android_ripple={{ color: Colors.selectedBg, borderless: true }}
                                style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', }}
                                onPress={() => shareDeal()}
                            >
                                <Image
                                    style={{ height: moderateScale(30), width: moderateScale(30) }}
                                    source={ImagePath.share}
                                    resizeMode='contain'
                                />

                            </Pressable>
                        </View>
                        {/* Row */}
                        <View style={{
                            // flex: 1,
                            marginTop: moderateScale(12),
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>

                            <View style={{
                                // alignSelf: 'flex-start' 
                                flex: 1,
                                flexShrink: 1
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <Text style={{
                                        ...TextStyles.large,
                                        ...styles.userName, flexShrink: 1
                                    }}>
                                        {`${formatNumberToFixed(offerDetail?.maxQuantity) || ''} ${(offerDetail?.symbol || '').toUpperCase()}`}
                                    </Text>

                                    <Components.LoaderImage
                                        imageUrl={((offerDetail?.coin_logo) ? offerDetail?.coin_logo : Image.resolveAssetSource(ImagePath.logo).uri)}
                                        indicatorSize='small'
                                        style={styles.curencyIconImg}
                                    />
                                    {/* <Image source={cryptoIcon} style={styles.curencyIconImg} /> */}
                                </View>
                                <View style={{}}>
                                    <Text style={{ ...TextStyles.small, ...styles.orderDate }}>{`${En.orderPlacedOn} ${offrCreateDate}`}</Text>
                                </View>
                            </View>
                            <View style={{
                                flex: 1
                            }}>
                                <Text style={{ ...TextStyles.large, ...styles.userName, textAlign: 'right' }}>
                                    {`${currencySymbol} ${((perCoinPrice) ? formatNumberToFixed(perCoinPrice ?? 0, 2) : 0 ?? '0')}`}
                                </Text>
                                <View style={{
                                }}>
                                    <Components.PricePercentText
                                        coinQty={offerDetail?.maxQuantity}
                                        selling_price={maxPrice}
                                        coinName={offerDetail?.coin}
                                        percentage={offerDetail?.percentage}
                                        currencyName={offerDetail?.currency_name}
                                        currencySymbl={offerDetail?.currency_symbol}
                                    />
                                </View>
                            </View>
                        </View >
                        {/* MARK: Partially deal detail */}
                        {offerDetail.sell_partially == true ?

                            <View style={{ marginTop: 10 }}>
                                <Text style={{ ...TextStyles.large, fontSize: textScale(16), }}>
                                    {`${En.Partial_order_available}`}
                                </Text>
                                {/* {`${En.Min_Ammount}: ${currencySymbol('INR')} ${offerDetail?.minAmount ?? ''}`} */}
                                <View style={{ gap: 0, }}>
                                    <Text style={{ ...TextStyles.medium, ...styles.userName }}> {`${En.Min_Ammount}: `}
                                        <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_green }}>{`${currencySymbol} ${(minPrice ? formatNumberToFixed(minPrice, 2) : '0')}`}</Text>
                                    </Text>
                                    <Text style={{ ...TextStyles.medium, ...styles.userName }}> {`${En.Max_Ammmount}: `}
                                        <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_green }}>{`${currencySymbol} ${(maxPrice ? formatNumberToFixed(maxPrice, 2) : '0')}`}</Text>
                                    </Text>
                                </View>
                            </View>
                            :
                             <View style={{ marginTop: 4 }}>
                             {/* <Text style={{ ...TextStyles.large, fontSize: textScale(16), }}>
                                 {`${En.Partial_order_available}`}
                             </Text> */}
                             {/* {`${En.Min_Ammount}: ${currencySymbol('INR')} ${offerDetail?.minAmount ?? ''}`} */}
                             <View style={{ gap: 0, }}>
                                 {/* <Text style={{ ...TextStyles.medium, ...styles.userName }}> {`${En.Min_Ammount}: `}
                                     <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_green }}>{`${currencySymbol} ${(minPrice ? formatNumberToFixed(minPrice, 2) : '0')}`}</Text>
                                 </Text> */}
                                 <Text style={{ ...TextStyles.medium, ...styles.userName }}> {`${En.Amount}: `}
                                     <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_green }}>{`${currencySymbol} ${(maxPrice ? formatNumberToFixed(maxPrice, 2) : '0')}`}</Text>
                                 </Text>
                             </View>
                         </View>
                        }
                        <View style={{ alignItems: 'flex-end', marginTop: moderateScale(8), zIndex: 999 }}>
                            <CustomButton title={btnTitle} containerStyle={styles.btnContainer} titleStyle={styles.btnTitle} isDigonal onPress={onPressBuy} />
                        </View>
                    </>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        shadowColor: Colors.shadow_LightBlack,
        shadowRadius: 2,
        shadowOpacity: 0.44,
        borderRadius: 8,
        shadowOffset: { height: 1.2, width: 0 },
        elevation: 7
    },

    innerContainer: {
        borderRadius: 8,
        overflow: 'hidden'
    },

    userImage: {
        height: moderateScale(35), width: moderateScale(35), borderRadius: 100
    },
    curencyIconImg: {
        height: moderateScale(20), width: moderateScale(20), borderRadius: 100,
        marginLeft: moderateScale(5),
        // borderWidth:1,
        // borderBottomColor:Colors.gradiantDwn
    }
    , userName: {
        fontSize: textScale(15),
    },
    userDisc: {
        color: Colors.text_DarkGray,
        marginRight: 0,
        textAlign: 'left',
        fontSize: textScale(12)
    },
    userCoins: {

    },
    orderDate: {
        color: Colors.text_DarkGray,
        marginRight: 0,
        textAlign: 'left',
        marginTop: moderateScaleVertical(4)
    },
    orderDiscript: {
        color: Colors.text_green,
        marginRight: 0,
        textAlign: 'right',
        marginTop: moderateScaleVertical(4)
    },

    btnContainer: {
        marginVertical: moderateScaleVertical(5),
    },

    btnTitle: {
        marginHorizontal: moderateScale(35)
    },

});

//make this component available to the app
// export default GetOfferComponent;
export default React.memo(GetOfferComponent);