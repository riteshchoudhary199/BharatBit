//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar, ActivityIndicator } from 'react-native';
import { copyText, currencySymbol, formatNumberToFixed, getCountryCurrencyCountryCode, showAlertMessage, success } from '../../../Utils/helperFunctions';
import { height, moderateScale, moderateScaleVertical, scale, textScale } from '../../../Styles/responsiveSize';
import * as Components from "../../../Components/indexx"
import Colors from '../../../Colors/Colors';
import { Alerts, Constants, En, ImageEnum, ImagePath, Titles } from '../../../Constants';
import { CommonStyles, TextStyles } from '../../../Styles/ComnStyle';
import moment from 'moment';
import Actions from '../../../Redux/Actions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl, TouchableHighlight } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import socketServices from '../../../Services/scoketService';
import { userProfile } from '../../../Redux/Reducers/AuthReducer';
import NavigationService from '../../../Services/NavigationService';
import { act } from 'react-test-renderer';



// create a component
const OfferDetail = ({ navigation, route }) => {
    const lastData = route?.params

    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    console.log("myProfileDetail : ---- ", myProfileDetail)
    const [lastScrnData, setlastScrnData] = useState(lastData)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [loadMore, setLoadMore] = useState(false);
    // const [modalData, setModalData] = useState({})
    const [offerDetail, setOfferDetail] = useState({})
    const [userDetail, setUserDetail] = useState({})
    const [alertTitle, setAlertTitle] = useState('')
    const [alertBtnTitle, setAlertBtnTitle] = useState('')
    const [activeDeals, setActiveDeals] = useState([]);
    const [showEmptyView, setShowEmptyView] = useState(false)
    const [showWaringModal, setShowWaringModal] = useState(false)

    const [refreshing, setRefreshing] = React.useState(false);
    console.log("offerDetail offerDetail: ---- ", offerDetail.userId)
    let offrCreateDate = moment(offerDetail?.createdAt).format('Do,MMM YYYY hh:mm a')
    //   const [optionsArr,setOptionArr] = useState([])
    const walletReducer = useSelector((state) => state?.wallet)
    const coinDetails = walletReducer?.coinsDetails
    const isOfferOpened = offerDetail?.offer_status == 'created' || offerDetail?.offer_status == 'pending'

    const [minPrice, setMinPrice] = useState()
    const [maxPrice, setMaxPrice] = useState()
    const [perCoinPrice, setPerCoinPrice] = useState('')

    const coin = offerDetail?.coin
    const curretCoin = coin === 'USDT' ? 'tether' : coin?.toLowerCase()
    const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
    const marketPrice = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? selectLiveCoin[offerDetail?.currency_name?.toLowerCase()] : selectLiveCoin['usd']
    const currencySymbol = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? offerDetail?.currency_symbol : '$'
    const adminDetails = useSelector((state) => state?.wallet?.adminDetails)

    const selectedCoinAdmin = adminDetails?.profits.find((item) => item?.coin_type == offerDetail?.coin)
    const adminMarginPercent = selectedCoinAdmin?.buyer
    const getAdminMargin = formatNumberToFixed(offerDetail.maxQuantity / maxPrice * (adminMarginPercent / 100 * maxPrice))

    // const activeDeals = offerDetail?.deals?.filter((ele)=>ele?.dealsData?.chatStatus !== 'canceled')

    useEffect(() => {
        calculatePrice()
    })
    useEffect(() => {
        calculatePrice()
    }, [coinDetails])

    const calculatePrice = () => {
        if (offerDetail?.sell_at_mp) {
            const minPrice = ((((marketPrice * offerDetail?.minQuantity) / 100) * offerDetail?.percentage) + (marketPrice * offerDetail?.minQuantity))
            const maxPrice = ((((marketPrice * offerDetail?.lockedQuantity) / 100) * offerDetail?.percentage) + (marketPrice * offerDetail?.lockedQuantity))
            const oneCoinPrice = (maxPrice / offerDetail?.maxQuantity)
            setPerCoinPrice(oneCoinPrice)
            if ((myProfileDetail?._id == offerDetail?.userId) && !isOfferOpened) {
                setMinPrice(offerDetail?.minAmount)
                setMaxPrice(offerDetail?.maxAmount)
            } else {
                setMinPrice(minPrice)
                setMaxPrice(maxPrice)
            }

            // const minPrice = parseFloat(minInitPrice) + parseFloat(minPercentPrice)
            // const maxPrice = parseFloat(maxInitPrice) + parseFloat(maxPercentPrice)


        } else {
            const minPrice = offerDetail?.maxAmount
            const maxPrice = offerDetail?.minAmount
            const oneCoinPrice = (maxPrice / offerDetail?.maxQuantity)
            setPerCoinPrice(oneCoinPrice)
            setMinPrice(minPrice)
            setMaxPrice(maxPrice)
        }
    }

    useEffect(() => {
        getOfferDetail()
    }, [lastScrnData])

    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    const onPressDeleteOffer = async () => {
        setAlertTitle(Alerts.DELETE_OFFER)
        setAlertBtnTitle(Titles.delete)
        setShowModal(true)
    }
    const onPressConfirm = async () => {

        closeAlert()
        if (alertTitle == Alerts.DELETE_OFFER) {
            deleteOffer()
        } else {
            confirmToBuy()
        }

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

    const onPressModifyOffer = (item) => {
        navigation.navigate(Constants.UpdateOffer, lastData)
    }


    const getOfferDetail = () => {
        setLoading(true)
        Actions.getAnOfferDetail(lastScrnData).then((res) => {
            console.log("res while make getOfferDetail is : --", res)
            const data = res?.data?.offer[0]
            console.log("data getOfferDetailis : --", data)
            setOfferDetail(data)
            const actv = offerDetail?.deals?.filter((ele) => ele?.dealsData?.chatStatus !== 'canceled')
            setActiveDeals(actv)
            setUserDetail(data?.user_details[0])
            setLoading(false)
            setRefreshing(false);
            // const msg = res?.message ? res.message : res.error
            // showAlertMessage(msg, success)
        }).catch((err) => {
            console.log("error from make transaction is : --", err)
            const msg = err?.message ? err.message : err.error
            setRefreshing(false);
            setLoading(false)
            showAlertMessage(msg)
        })
    }
    const deleteOffer = () => {
        setLoading(true)
        console.log('lastScrnData lastScrnData : ---', lastScrnData)

        Actions.deleteAnOffer(lastScrnData).then((res) => {
            console.log("res while make getOfferDetail is : --", res)
            // const data = res?.data?.offer[0]
            // console.log("data getOfferDetailis : --", data)

            // setOfferDetail({})
            setLoading(false)
            NavigationService.goBack()
            // const msg = res?.message ? res.message : res.error
            // showAlertMessage(msg, success)
        }).catch((err) => {
            console.log("error from make transaction is : --", err)
            const msg = err?.message ? err.message : err.error
            setLoading(false)
            showAlertMessage(msg)
        })
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getOfferDetail()
        }, 2000);
    }, []);

    const onPressBuy = async () => {
        setAlertTitle(Alerts.Are_you_want_to_buy)
        setAlertBtnTitle(Titles.Yes)
        setShowModal(true)

    }
    const confirmToBuy = async () => {
        if (offerDetail?.sell_partially == true) {
            const payLoad = { userDetail: userDetail, offerDetail: offerDetail, myProfileDetail: myProfileDetail }
            console.log('confirmToBuyconfirmToBuy :---', payLoad);
            navigation.navigate(Constants.BuyDeal, payLoad)
            return
        } else if (btnTitle === 'canceled') {
            showAlertMessage("You already canceled this offer")
        } else {
            setShowWaringModal(true)
        }
        closeAlert()
    }

    const reInitiateDeal = () => {
        // showAlertMessage('reInitiateDeal reInitiateDeal reInitiateDeal')
        closeAlert()
        if (!dealHistory?.chatExchangeId && !offerDetail?.userId) {
            showAlertMessage('No chat Id or bued id found')
            return
        }
        const data = {
            // chatexchangeId: dealHistory?.chatExchangeId,
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
            receiver: userDetail?._id,
            sender: myProfileDetail?._id,
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

    const paymentMetodVw = () => {
        return (
            <View style={styles.amountfromWalletContainer}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: moderateScaleVertical(20) }}>
                    {(offerDetail?.pay_details != undefined) &&
                        offerDetail?.pay_details.map((item, index) =>
                            <View key={index} style={styles.paymentMethod}>
                                <View
                                >
                                    <Components.LoaderImage
                                        imageUrl={item?.image.includes('http') ? item?.image : `${ImagePath}${item?.image}`}
                                        placeHolderUrl={Image.resolveAssetSource(ImagePath.payType).uri}
                                        style={{ ...styles.itemSwichIcon, marginRight: 5 }}
                                        indicatorSize={'small'}
                                        resizeMode={ImageEnum.contain}
                                    />

                                </View>
                                <Text style={{ ...TextStyles.medium, ...styles.itemPaymTypeTitle, }}
                                // onPress={() => setSelectedPaymentMethod(item.id)}
                                >{item?.name || ''}</Text>
                            </View>
                        )}
                </View>
            </View>
        )
    }
    const OfferStatusText = () => {
        let status = offerDetail?.offer_status
        // "created","pending","successful","deleted"
        const statusText = status == 'successful' ? 'completed' : status == 'created' ? 'Open' : status == 'pending' ? 'Open' : status
        return (
            <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', top: 0 }}>

                {/* <Text style={{
                    ...TextStyles.bold, fontSize: textScale(20), color: Colors.text_lightBlack
                }}>
                    {'Status :'}
                </Text> */}


                <Text style={{
                    ...TextStyles.bold, fontSize: textScale(20), color: statusText == 'Open' ?
                        Colors.text_Yellow : statusText == 'completed' ? Colors.text_green : Colors.text_red_dark, alignSelf: 'flex-end'
                }}>
                    {`${(statusText || '').charAt(0).toUpperCase() + (statusText || 'Nil').slice(1)}`}
                </Text>
            </View>

        )
    }

    const HeaderItem = () => {
        return (
            <>
                <View style={styles.innerContainer}>


                    {!loading &&

                        <View style={{ gap: 15, marginTop: 15 }}>


                            {/* MARK: Title */}
                            <View style={{ gap: 2 }}>
                                {(myProfileDetail?._id == offerDetail?.userId) &&
                                    <>
                                        {/* <OfferStatusText /> */}



                                        <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{`${En.offerId}`}</Text>
                                        <Text
                                            style={{ ...TextStyles.small, ...styles.textDarkGray, justifyContent: 'center', alignItems: 'center' }}
                                            onLongPress={() => copyText(offerDetail?._id)}
                                        >{`${offerDetail?._id}`} <Image source={ImagePath.copy} style={{ height: scale(12), width: scale(15) }} resizeMode='contain' /></Text>
                                    </>
                                }
                                {/* <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{En.Description}</Text> */}
                            </View>

                            <View style={{ gap: 2 }}>
                                <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{En.Title}</Text>
                                <Text style={{ ...TextStyles.small, ...styles.textDarkGray }}>{offerDetail?.title || ''}</Text>
                            </View>

                            <View style={{ gap: 2 }}>
                                <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{En.Description}</Text>
                                <Text style={{ ...TextStyles.small, ...styles.textDarkGray }}>
                                    {offerDetail?.description || ''}
                                </Text>
                            </View>

                            <View style={{ gap: 2 }}>
                                {/* {`${ formatNumberToFixed((myProfileDetail?._id == offerDetail?.userId) ? offerDetail?.lockedQuantity:maxPrice) || ''} ${offerDetail?.symbol?.toUpperCase()}`} */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>

                                        {`${formatNumberToFixed(perCoinPrice ?? 0) || ''} ${offerDetail?.symbol?.toUpperCase()}`}

                                        {/* {`${offerDetail?.quantity || ''} ${(offerDetail?.symbol || '').toUpperCase()}`} */}
                                    </Text>
                                    <Components.LoaderImage
                                        imageUrl={((offerDetail?.coin_logo) ? offerDetail?.coin_logo : '')}
                                        indicatorSize='small'
                                        style={{ height: moderateScale(18), width: moderateScale(18), borderRadius: 100 }}
                                    />
                                    {/* <Image source={ImagePath.bitcoin}/> */}
                                </View>
                                <Text style={{ ...TextStyles.small, ...styles.textDarkGray }}>{En.Order_placed_on}
                                    <Text style={{ ...TextStyles.small }}>{offrCreateDate || ''}</Text></Text>
                            </View>

                            <View style={{ gap: 5 }}>
                                <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>
                                    {`${currencySymbol} ${((maxPrice) ? formatNumberToFixed(maxPrice, 2) : 0 ?? '0')}`}
                                    {/* {`${currencySymbol('INR')} ${offerDetail?.selling_price}`} */}
                                </Text>
                                {/* <Text style={{ ...TextStyles.small, color: Colors.text_green }}>{`0.7% ${En.below_Market_Price}`}</Text> */}
                                <Components.PricePercentText
                                    coinQty={offerDetail?.maxQuantity}
                                    selling_price={maxPrice}
                                    coinName={offerDetail?.coin}
                                    percentage={offerDetail?.percentage}
                                    textStyle={{ textAlign: 'left' }}
                                    currencyName={offerDetail?.currency_name}
                                    currencySymbl={offerDetail?.currency_symbol}
                                />

                            </View>

                            <View style={{ gap: moderateScale(10) }}>
                                <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{En.Payment_Method}</Text>
                                {paymentMetodVw()}
                            </View>

                            {/* MARK :----   Prtial offer detail */}

                            {offerDetail.sell_partially == true ?
                                <View style={{ gap: moderateScale(10) }}>
                                    <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>
                                        {`${En.Partial_order}`}
                                    </Text>
                                    {/* {`${En.Min_Ammount}: ${currencySymbol('INR')} ${offerDetail?.minAmount ?? ''}`} */}
                                    <View style={{ alignItems: 'flex-start' }}>
                                        <View style={{ backgroundColor: Colors.bg_textfld_dark, borderRadius: 5, paddingEnd: moderateScale(25), gap: 2, paddingVertical: moderateScaleVertical(3) }}>
                                            <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_lightBlack }}> {`${En.Min_Ammount}: `}
                                                <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_lightBlack }}>{`${currencySymbol} ${(minPrice ? formatNumberToFixed(minPrice, 2) : '0')}`}</Text>
                                            </Text>
                                            <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_lightBlack }}> {`${En.Max_Ammmount}: `}
                                                <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_lightBlack }}>{`${currencySymbol} ${(maxPrice ? formatNumberToFixed(maxPrice, 2) : '0')}`}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                :

                                <View style={{ gap: moderateScale(10) }}>
                                    {/* <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>
                                        {`${En.Partial_order}`}
                                    </Text> */}
                                    {/* {`${En.Min_Ammount}: ${currencySymbol('INR')} ${offerDetail?.minAmount ?? ''}`} */}
                                    {/* `${ formatNumberToFixed((myProfileDetail?._id == offerDetail?.userId) ? offerDetail?.lockedQuantity:maxPrice) || ''} ${offerDetail?.symbol?.toUpperCase()}` */}

                                    <View style={{ alignItems: 'flex-start' }}>
                                        <View style={{ backgroundColor: Colors.bg_textfld_dark, borderRadius: 5, paddingEnd: moderateScale(25), gap: 2, paddingVertical: moderateScaleVertical(3) }}>
                                            <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_lightBlack }}> {`${En.Amount}: `}
                                                <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_lightBlack }}>{`${currencySymbol} ${(maxPrice ? formatNumberToFixed((myProfileDetail?._id == offerDetail?.userId) ? offerDetail?.lockedQuantity : maxPrice) || '' : '0')}`}</Text>
                                            </Text>
                                            {/* <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_lightBlack }}> {`${En.Max_Ammmount}: `}
                                                <Text style={{ ...TextStyles.medium, ...styles.userName, color: Colors.text_lightBlack }}>{`${currencySymbol} ${(maxPrice ? formatNumberToFixed(maxPrice, 2) : '0')}`}</Text>
                                            </Text> */}
                                        </View>
                                    </View>
                                </View>


                            }
                            {/* MARK :----  Delete Buy and modify buttons */}

                            <View style={{ gap: moderateScale(10) }}>

                                {(myProfileDetail?._id == offerDetail?.userId) ?
                                    (isOfferOpened) &&
                                    <View style={{ gap: 15, flex: 1, marginTop: moderateScale(60) }}>
                                        <Components.CustomButton title={Titles.Modify_Offer}
                                            containerStyle={styles.modifyButton}
                                            onPress={() => onPressModifyOffer()} />

                                        <TouchableHighlight
                                            style={{ ...CommonStyles.button, ...styles.deleteButton }}
                                            underlayColor={Colors.app_White}
                                            onPress={() => onPressDeleteOffer()}
                                        >
                                            <Components.GradientText
                                                colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                                                onPress={() => onPressDeleteOffer()}
                                                style={{ ...TextStyles.btnTitle, }}
                                            >
                                                {Titles.Delete_Offer}
                                            </Components.GradientText>
                                        </TouchableHighlight>
                                    </View> :
                                    <View style={{ gap: 15, flex: 1, marginTop: moderateScale(60) }}>
                                        <Components.CustomButton title={Titles.Buy}
                                            containerStyle={styles.modifyButton}
                                            onPress={() => onPressBuy()} />
                                    </View>
                                }
                            </View>




                        </View>
                    }

                </View>
                {(!loading && offerDetail) &&
                    (myProfileDetail?._id == offerDetail?.userId) &&

                    <View style={{ marginTop: 20, gap: moderateScale(10), marginBottom: moderateScaleVertical(20), marginStart: 5 }}>
                        <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{En.Trade_History}</Text>
                    </View>
                }
            </>

        )
    }
    // const RenderFooterView = () => {
    //     return (
    //         <View
    //             style={{
    //                 width: "100%", alignItems: 'center', justifyContent: 'center',
    //             }}
    //         >
    //             {(!loadMore && !loading) &&
    //                 <Text>No more data found</Text>
    //             }
    //             {(loadMore) &&
    //                 <ActivityIndicator size={'large'} color={Colors.gradiantDwn}
    //                     style={styles.indicator}
    //                 />
    //             }
    //         </View>
    //     );
    // };
    const ItemSeparatorView = () => {
        return (
            // FlatList Item Separator
            <View
                style={{
                    height: 2,
                    width: '100%',
                    //   backgroundColor: '#C8C8C8'
                }}
            />
        );
    };
    const OfferDeatilComonent = ({ item }) => {
        // console.log('OfferDeatilComonent : --',item);
        return (
            // FlatList Item
            <View>
                <Components.TradeComponent
                    data={item}
                    currency_symbol={offerDetail?.currency_symbol}
                    coin={offerDetail?.coin}
                    currency_name={offerDetail?.currencyName}
                    navigation={navigation}
                // containerStyle={styles.reuseContainer} onPressBuyBtn={() => actionBuy()}

                />
            </View>
        );
    };
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_Bg }}>
                <StatusBar backgroundColor={Colors.app_Bg} barStyle={'dark-content'} />
                <Components.HeaderComponent contanerStyle={{ backgroundColor: Colors.app_Bg }}
                    subHeaderStyle={{ marginBottom: moderateScale(0) }}
                    headerText={En.Offer_Details}
                    showLeftArrow={true}
                    navigation={navigation}
                />
                <View style={styles.container}>
                    {/* <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} tintColor={Colors.gradiantDwn} title={En.loading} onRefresh={onRefresh} />
                        }
                    > */}

                    <View >

                        {(!loading && offerDetail) &&
                            // (myProfileDetail?._id == offerDetail?.userId) &&
                            <FlatList
                                contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
                                initialNumToRender={10}
                                showsVerticalScrollIndicator={false}
                                style={{ marginTop: moderateScale(10) }}
                                data={activeDeals}
                                ListHeaderComponent={HeaderItem}
                                // ListFooterComponent={RenderFooterView}//{<View style={{ height: moderateScaleVertical(80), }} />}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={(myProfileDetail?._id == offerDetail?.userId) && OfferDeatilComonent}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={(!loading && (myProfileDetail?._id == offerDetail?.userId)) && <Components.EmptyList subTitle={Alerts.EMPTY_DEAL} contanerStyle={{ marginVertical: moderateScale(0), paddingVertical: 10 }} />}
                                onEndReachedThreshold={0.5}
                                automaticallyAdjustContentInsets={false}
                                refreshControl={
                                    <RefreshControl displayName={'Loading'} style={{ color: Colors.gradiantDwn }} tintColor={Colors.gradiantDwn} title={En.loading} refreshing={refreshing} onRefresh={onRefresh} />
                                }

                            />
                        }

                    </View>

                    {/* </ScrollView> */}
                </View>
                <Components.CustomPopUp
                    onHardwareBackPress={closeAlert}
                    onClickTouchOutside={closeAlert}
                    scaleAnimationDialogAlert={showModal}
                    HeaderTitle={Alerts.ALLERT}
                    AlertMessageTitle={alertTitle}
                    leftBtnText={Titles.Cancel}
                    rightBtnText={alertBtnTitle}
                    onPressLeftBtn={closeAlert}
                    onPressRightBtn={onPressConfirm}
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
            </SafeAreaView>
            {(loading && !refreshing) && <Components.CustomLoader />}
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.app_Bg

    },
    innerContainer: {
        paddingHorizontal: moderateScale(20),
        justifyContent: 'center',

    },
    header: {},
    subheaders: {
        fontSize: 20
    },
    textDarkGray: {
        color: Colors.darkGrayTxt
    },
    amountfromWalletContainer: {
        marginTop: moderateScaleVertical(5),
        gap: 2
    },
    itemSwichIcon: {
        overflow: 'hidden',
        height: moderateScale(18),
        width: moderateScale(18),
        borderRadius: 100,
        marginRight: moderateScale(10),
    },
    itemPaymTypeTitle: {
        color: Colors.text_lightBlack,
        // fontSize:18,
        marginRight: 5
    },
    paymentMethod: {
        height: moderateScale(40),
        // justifyContent:'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 0,
        backgroundColor: Colors.bg_textfld_dark,
        borderColor: Colors.border_textfld_dark
    }, modifyButton: {
        // marginTop: moderateScale(50),
        height: moderateScale(55),
        marginHorizontal: moderateScale(15)
    }, deleteButton: {
        borderColor: Colors.gradiantDwn,
        backgroundColor: Colors.app_Bg,
        borderWidth: 1.2,
        alignItems: 'center',
        justifyContent: 'center', height: moderateScale(55),
        marginHorizontal: moderateScale(15)
    }, userName: {
        fontSize: textScale(17),
    },
});

//make this component available to the app
export default OfferDetail;
