//import liraries
import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, Clipboard } from 'react-native';
import { TextStyles } from '../../Styles/ComnStyle';
import { height, moderateScale, moderateScaleVertical, scale, textScale, width } from '../../Styles/responsiveSize';
import { Alerts, En, ImageEnum, ImagePath, Titles } from '../../Constants';
import Colors from '../../Colors/Colors';
import { copyText, currencySymbol, delayed, formatNumberToFixed, getCountryCurrencyCountryCode, showAlertMessage, success, warning } from '../../Utils/helperFunctions';
import * as Components from "../indexx"

import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import Actions from '../../Redux/Actions';
import socketServices from '../../Services/scoketService';
import { useFocusEffect } from '@react-navigation/native';
import { MessageType, UserPayActions } from '../../Constants/Enum';

// create a component
const UserDetailVw = ({ userData, userId, otherUserDetail,
    statusDetail, transaction, tradeDetail, transRecivedLintnerData, navigation, sendNewMessage = () => { }, updateChat = () => { }
}) => {
    // const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loader, setLoader] = useState(false)

    const [loadRaiseADipute, setLoadRaiseADipute] = useState(false)

    const [showRaiseDisputeModal, setShowRaiseDisputeModal] = useState(false)
    const [modalData, setModalData] = useState({})
    const [statusDetails, setStatusDetail] = useState(statusDetail)

    const [offerDetail, setOfferDetail] = useState(userData)

    const [clearRaiseADispute, setClearRaiseADispute] = useState('')
    const homeRedux = useSelector((state) => state?.homeReducer)
    // const allCoinsList = homeRedux?.allCoinsList
    const disputeDetail = homeRedux?.disputeTypes

    console.log('disputeDetail disputeDetail disputeDetail:-----', disputeDetail)
    useEffect(useCallback(() => {
        setStatusDetail(statusDetail)
    }, [statusDetail]
    ))
    const disputedBy = offerDetail?.userId == userId ? 'seller' : 'buyer'
    const dis = disputedBy == 'seller' ? disputeDetail?.seller : disputeDetail?.buyer
    const disputeTypeArr = dis ? dis : ['']
    const offrCreateDate = moment(offerDetail?.createdAt).format('Do, MMM YYYY hh:mm a')
    //   const [optionsArr,setOptionArr] = useState([])


    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    const disputeByUser = offerDetail?.userId == userId ? myProfileDetail : otherUserDetail
    const chatStatus = statusDetails?.chatDetails?.chatStatus
    // MARK: -- Dispute message 

    const walletReducer = useSelector((state) => state?.wallet)
    const coinDetails = walletReducer?.coinsDetails

    const [sellMarketPrice, setSellMarketPrice] = useState('')
    const [sellDealPrice, setSellDealPrice] = useState(tradeDetail?.sellingAmount)
    // const [currencySymbol, setCurrencySymbol] = useState('')
    const coin = offerDetail?.coin
    const curretCoin = coin === 'USDT' ? 'tether' : coin?.toLowerCase()
    const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
    const marketPrice = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? selectLiveCoin[offerDetail?.currency_name?.toLowerCase()] : selectLiveCoin['usd']
    const currencySymbol = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? offerDetail?.currency_symbol : '$'


    useEffect(() => {
        calculatePrice()
    },)
    useEffect(() => {
        calculatePrice()
    }, [coinDetails])
    const calculatePrice = () => {
        if (offerDetail?.sell_at_mp) {
            const sellPrice = ((((marketPrice * tradeDetail?.sellingQuantity) / 100) * offerDetail?.percentage) + (marketPrice * tradeDetail?.sellingQuantity))
            setSellMarketPrice(sellPrice)
        } else {
            const maxPrice = tradeDetail?.sellingAmount
            // setSellDealPrice(maxPrice)
        }
    }


    // MARK: -- Dispute  
    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    const closeDisputeAlert = () => {
        setShowRaiseDisputeModal(false)
        return true
    }
    const showAlertModal = (title, message, onAccept = () => { }) => {

        const data = {
            title: title,
            message: message,
            onAccept: onAccept,
        }
        setShowModal(true)
        setModalData(data)

    }

    let senderOptionsArr = [
        {
            id: 1, value: En.Release, bgColor: Colors.bg_green_Dark, textColor: Colors.text_White, message: 'Are you sure you have recived payment', status: 'received'
        },
        {
            id: 2, value: En.Cancel_Deal, bgColor: Colors.bg_red_Dark, textColor: Colors.text_White, message: "Are you sure your wana cancel Deal", status: 'not_received'
        },
        {
            id: 3, value: En.Raise_Dispute, bgColor: Colors.bg_lemmon_Dark, textColor: Colors.text_White, message: "Are you sure you wana have to raise a dispute upon this.", status: 'raise_a_dispute'
        }
    ]

    let buyerOptionsArr = [
        {
            id: 1, value: En.Paid, bgColor: Colors.bg_green_Dark, textColor: Colors.text_White, message: "Are you sure you have sucesfully pay.", status: 'paid'
        },
        {
            id: 2, value: En.Cancel_Deal, bgColor: Colors.bg_red_Dark, textColor: Colors.text_White, message: "Are you sure your wana cancel Deal.", status: 'pending'
        },
        {
            id: 3, value: En.Raise_Dispute, bgColor: Colors.bg_lemmon_Dark, textColor: Colors.text_White, message: "Are you sure you wana raise a dispute upon this trade.If then please Attach document or picture of evidences. ", status: 'raise_a_dispute'
        }
    ]
    const optionsArr = userData.userId == userId ? senderOptionsArr : buyerOptionsArr
    const onChangeStatus = (item) => {

        showAlertModal('Alert', item?.message, () => checkStatus(item))//onAccept = updateStatus(item)
    }

    const checkStatus = (item) => {
        // await updateStatus(item)
        // console.log("checkStatus is : --",item)
        if (item.id == 1) {
            closeAlert()
            item.value == En.Paid ? emitToPaid() : emitToRecived()
        }
        else if (item.id == 2 && item.value == En.Cancel_Deal) {
            closeAlert()
            cancelDeal()
        } else if (item.id == 3 && item.value == En.Raise_Dispute) {
            closeAlert()
            setShowRaiseDisputeModal(true)
        } else {

        }

    }

    const cancelDeal = async () => {
        // console.log("cancelDeal cancelDeal cancelDeal is : --")
        const exchngId = statusDetails?.chatDetails?._id
        // setLoading(true)
        const data = {
            chatexchangeId: exchngId,
            isTimeOut: false
        }

        // socketServices.emit('cancelDeal', data)
        socketServices.socket.emit("cancelDeal", data, function (response) {

            const chatDetil = response?.result?.chatDetails
            const offerDetails = response?.result?.offerDetails
            const status = { ...statusDetails, chatDetails: chatDetil }
            setOfferDetail(offerDetails)
            setStatusDetail(status)
            sendMessageToSocket("cancelDeal", "I was cancel this deal")
            console.log("socket respons cancelDeal emit is  >>>>>>>>>>", response,);
            updateChat()
        });

    }
    console.log("socket respons cancelDeal emit is status status >>>>>>>>>>", statusDetail,);

    const emitToPaid = () => {
        // const id = offerDetail.userId == userId ? otherUserDetail?._id : userId

        console.log("emitToPaid payent ", statusDetails)
        const buyer_status = statusDetails?.transactionDetail?.buyer_status
        if (buyer_status && buyer_status == 'paid') {
            showAlertMessage('You alreay update paid status', warning)
            // return
        }
        const exchngId = statusDetails?.chatDetails?._id
        const data = {
            chatexchange_id: exchngId,
        }
        if (exchngId) {
            // showAlertMessage('Status already exchngId')
            console.log("socket respons transactionpaid emit  data  is  >>>>>>>>>>", data);


            socketServices.socket.emit("transactionpaid", data, function (response) {
                console.log("socket respons transactionpaid emit is  >>>>>>>>>>", response);
                sendMessageToSocket("transactionpaid", "I was paid for this deal")
                // const transDeatil = response?.result?.transactionDetail
                // const status = { ...statusDetails, transactionDetail: transDeatil }
                // setStatusDetail(status)
                updateChat(response)

            });


            // updateChat()
            console.log("socket respons transactionpaid emit is  >>>>>>>>>>");
            // updateChat()
            // },5000)
        }
    }
    const emitToRecived = () => {
        const seller_status = statusDetails?.transactionDetail?.seller_status
        if (seller_status == 'received') {
            showAlertMessage('Status already updated', warning)
            return
        }
        console.log("emitToRecived payent ")

        const transId = statusDetails?.transactionDetail?._id
        const data = {
            transaction_id: transId,
        }

        socketServices.socket.emit("transactionreceived", data, function (response) {
            console.log("socket respons transactionreceived emit is  >>>>>>>>>>", response,);
            sendMessageToSocket("transactionreceived", "Payment recived to me")
            updateChat(response)
        });
        // updateChat()
    }

    // MARK:----- Dispute message 

    const onSubmitRaseDispute = async (data) => {
        const transId = statusDetails?.transactionDetail?._id
        if (!transId) {
            showAlertMessage('Transaction Id not available')
            return
        }
        if (!data?.disputeType) {

            return
        } else if (!data?.discription) {
            showAlertMessage('Please enter message')
            return
        }
        else if (!data?.fileData) {
            showAlertMessage('Please attach file')
            return
        }
        console.log("file dat ais ", data?.disputeType, data?.discription, data?.fileData,)
        // return
        setLoadRaiseADipute(true);

        const formData = new FormData();
        if (data?.fileData) {
            formData.append("file", {
                uri: data?.fileData?.uri,
                name: data?.fileData?.name,//`${name.split(" ").join("_") + "_" + new Date().getTime()}.jpg`,
                type: data?.fileData?.type,
            });

        } else {
        }
        console.log("form data file is ", formData)
        let header = {
            "Content-Type": "multipart/form-data",
        };
        await Actions.updloadFile(formData, header).then(async (res) => {
            console.log("upload profile response is success res", res)
            serverFileUrl = res?.data ? res.data : ''
            const payload = {
                file: res?.data?.fileName,
                raised_by: disputedBy,
                type: data?.disputeType?.title,
                transaction_id: transId,
                message: data?.discription
            }

            socketServices.socket.emit('RaiseADispute', payload, function (res) {

                console.log('RaiseADisputeRaiseADisputeRaiseADispute resres :--', res);

           
            showAlertMessage((res?.message) ? (res?.message) : (res?.error), alertType = (res?.error) ? danger : success)
            setLoadRaiseADipute(false);
            closeDisputeAlert()
            updateChat()
            setClearRaiseADispute(true)

            const disputMesage = JSON.stringify({
                userType: disputedBy === 'seller' ? 'Seller' : 'Buyer',
                disputedBy: myProfileDetail?.username ?? '',
                title: data?.disputeType?.title ?? '',
                discription: data?.discription ?? '',
            });
            const modratorMessage = JSON.stringify({
                userType: disputedBy === 'seller' ? 'Seller' : 'Buyer',
                disputedBy: myProfileDetail?.username ?? '',
                title: data?.disputeType?.title ?? '',
                discription: data?.discription ?? '',
                message: 'Moderator will contact you via email for further evidence or proofs.Please be active with your BharatBit registered email id.'
            });

            setLoadRaiseADipute(false);
            sendMessageToSocket(MessageType.raiseADispute, disputMesage)
            const wt = delayed(2000)
            sendMessageToSocket(MessageType.modrator, modratorMessage)
        })
        })
            .catch((error) => {
                console.log("catch error in upload profile respons", error);
                const errMsg = error?.message ? error?.message : error?.error
                showAlertMessage(errMsg, alertType = danger)
                setLoadRaiseADipute(false);
            });
        console.log('uploads uploads uploads uploads : -0--- ')
    }

    const sendMessageToSocket = (type, message) => {

        let messageData = {
            userId: otherUserDetail?._id,//ReciverId
            message: message,
            file: '',
            offerId: offerDetail?._id, // offerId
            message_type: type,
            chatex: tradeDetail?.chatExchangeId,

        }
        console.log('message sending data is : -- ', messageData)
        socketServices.socket.emit("message", messageData, function (response) {
            console.log('message sendMessageToSocket :----- ', response)
            sendNewMessage(response?.result)
        });
        // socketServices.emit('message', messageData, function (res) {
        //     console.log('message sendMessageToSocket :----- ', res)
        //     sendNewMessage(res)
        // })
    }

    const paymentMetodVw = () => {
        return (
            <View style={styles.amountfromWalletContainer}>
                {offerDetail?.pay_details &&
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: moderateScaleVertical(20) }}>
                        {offerDetail?.pay_details.map((item, index) =>
                            <View style={styles.paymentMethod}>
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
                }
            </View>
        )
    }

    const CustomStatusBtn = (item, disabled) => {
        return (
            <View style={{ backgroundColor: item.bgColor, opacity: !disabled ? 1 : 0.5, borderRadius: 8 }}>
                <TouchableHighlight
                    style={{}}
                    underlayColor={Colors.transparent}
                    onPress={() => !disabled && onChangeStatus(item)}
                >
                    <Text style={{
                        ...TextStyles.medium, paddingHorizontal: moderateScale(15),
                        marginVertical: moderateScale(8), color: item.textColor
                    }}
                    >{item.value || ''}
                    </Text>
                </TouchableHighlight>
            </View>
        )

    }
    const statusButtons = () => {
        const chatBy = offerDetail?.userId == userId ? 'seller' : 'buyer'
        const transDetail = statusDetails?.transactionDetail
        const seller_status = transDetail?.seller_status
        const buyer_status = transDetail?.buyer_status
        console.log('status detail is : ---', statusDetails);
        // chatStatus
        return (
            // <View style={{}}>
            <>
                {/* ((transDetail !== "" && transDetail?.transaction_status == 'completed' || chatStatus == "completed")) */}
                {((transDetail !== "" && transDetail?.transaction_status == 'completed' || chatStatus == "successful")) ?
                    <View style={{}}>
                        <View style={{
                            backgroundColor: 'rgba(0, 153, 43, 0)',
                            borderRadius: 20,
                            borderColor: 'rgba(0, 153, 43, 1)', borderWidth: 0,
                            alignItems: 'center',
                            // paddingBottom: moderateScale(30),
                            overflow: 'hidden'
                        }}>
                            <Image
                                source={ImagePath.aniRight}
                                style={{ height: scale(250), alignSelf: 'center', flex: 1 }}
                                resizeMode='contain'
                            />
                            {/* <Text style={{ ...TextStyles.bold, color: 'rgba(0, 153, 43, 1)', textAlign: 'center' }}> {`Congratulations! \nYour deal was Sucessfull`}</Text> */}
                        </View>
                    </View> :
                    ((statusDetails !== undefined && statusDetails?.chatDetails?.isCanceled === true || chatStatus == "canceled")) ?
                        <View style={{}}>


                            <View style={{
                                backgroundColor: 'rgba(0, 153, 43, 0)',
                                borderRadius: 20,
                                borderColor: 'rgba(0, 153, 43, 1)', borderWidth: 0,
                                alignItems: 'center',
                                // paddingBottom: moderateScale(30),
                                overflow: 'hidden'
                            }}>
                                <Image
                                    source={ImagePath.aniWrong}
                                    style={{ height: scale(250), alignSelf: 'center', flex: 1 }}
                                    resizeMode='contain'
                                />
                                {/* <Text style={{ ...TextStyles.bold, color: 'rgba(0, 153, 43, 1)', textAlign: 'center' }}> {`Congratulations! \nYour deal was Sucessfull`}</Text> */}
                            </View>
                        </View > :
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                            {optionsArr.map((item) =>
                                <>
                                    {
                                        (item.value == En.Release) &&
                                        <>

                                            {(chatBy == 'buyer') ?

                                                <></> :
                                                <>
                                                    {(((transDetail === "") || !transDetail?.seller_status)) ? <></> :
                                                        ((!(transDetail === "") || transDetail?.buyer_status === UserPayActions.paid || transDetail?.buyer_status === UserPayActions.raise_a_dispute)) ? <>{CustomStatusBtn(item, false)}</> : <>{CustomStatusBtn(item, true)}</>

                                                    }
                                                </>
                                            }

                                            {(chatBy == 'buyer') && <></>}
                                            {(chatBy == 'seller' && ((transDetail === "") || !transDetail?.seller_status)) && <></>}
                                            {(chatBy == 'seller' && (!(transDetail !== "") && (transDetail?.buyer_status === UserPayActions.paid || transDetail?.buyer_status === UserPayActions.raise_a_dispute) && transDetail?.seller_status !== UserPayActions.received)) ? <>{CustomStatusBtn(item, false)}</> :
                                                (chatBy == 'seller' && (!(transDetail !== "") || transDetail?.seller_status === UserPayActions.received)) && <>{CustomStatusBtn(item, true)}</>
                                            }
                                            {/* {(chatBy == 'seller' && (!(transDetail !== "") || transDetail?.seller_status === UserPayActions.received)) && <>{CustomStatusBtn(item, true)}</> } */}
                                        </>

                                    }

                                    {(item.value == En.Paid) &&
                                        <>
                                            {/* {CustomStatusBtn(item, false)} */}
                                            {(chatBy == 'seller') ?

                                                <>{CustomStatusBtn(item, false)}</> :
                                                <>
                                                    {(((transDetail === "") || !transDetail?.seller_status)) && <>{CustomStatusBtn(item, false)}</>}
                                                    {((!(transDetail === "") || transDetail?.buyer_status === UserPayActions.paid)) && <>{CustomStatusBtn(item, true)}</>}
                                                </>
                                            }
                                        </>

                                    }
                                    {item.value == En.Cancel_Deal &&

                                        <>
                                            {(chatBy == 'seller') ? <></> : <>{CustomStatusBtn(item, false)}</>}
                                            {/* {(chatBy == 'buyer' && <>{CustomStatusBtn(item, false)}</>}
                                            {(chatBy == 'buyer' && (!(transDetail !== "") || transDetail?.buyer_status === UserPayActions.paid)) && <>{CustomStatusBtn(item, true)}</>}
                                            {(chatBy == 'buyer' && (!(transDetail !== "") || transDetail?.seller_status !== UserPayActions.paid)) && <>{CustomStatusBtn(item, false)}</>} */}
                                        </>

                                    }
                                    {item.value == En.Raise_Dispute &&

                                        <>
                                            {(chatBy == 'seller') ?

                                                <>
                                                    {(((transDetail === ""))) && <></>}
                                                    {((!(transDetail == "") && (transDetail?.buyer_status === UserPayActions.paid && transDetail?.seller_status !== UserPayActions.raise_a_dispute && transDetail?.buyer_status !== UserPayActions.raise_a_dispute))) ? <>{CustomStatusBtn(item, false)}</> :
                                                        ((!(transDetail == "") && (transDetail?.seller_status === UserPayActions.raise_a_dispute || transDetail?.buyer_status === UserPayActions.raise_a_dispute))) && <>{CustomStatusBtn(item, true)}</>
                                                    }
                                                </> :
                                                <>
                                                    {(((transDetail === ""))) && <></>}
                                                    {(((transDetail !== "") && (transDetail?.buyer_status == UserPayActions.paid && transDetail?.seller_status !== UserPayActions.raise_a_dispute && transDetail?.buyer_status !== UserPayActions.raise_a_dispute))) ? <>{CustomStatusBtn(item, false)}</> :
                                                        <>{CustomStatusBtn(item, true)}</>
                                                    }
                                                    {/* ((!(transDetail == "") && (transDetail?.buyer_status === UserPayActions.paid)  && (transDetail?.buyer_status === UserPayActions.raise_a_dispute))) && <>{CustomStatusBtn(item, true)}</> */}
                                                </>
                                            }
                                        </>

                                    }
                                </>
                                // <>
                                //     {(chatBy == 'seller' && (!(transDetail !== "") || transDetail?.seller_status === UserPayActions.received) && item.value == En.Release) ? <>{CustomStatusBtn(item, true)}</> :
                                //         (chatBy == 'buyer' && ((transDetail !== "") || transDetail?.buyer_status === UserPayActions.paid) && item.value == En.Paid) ? <>{CustomStatusBtn(item, true)}</> :
                                //             (chatBy == 'buyer' && (((transDetail !== "") || transDetail?.buyer_status === UserPayActions.paid)) && item.value == En.Cancel_Deal) ? <>{CustomStatusBtn(item, false)}</> :
                                //                 ((chatBy == 'seller') && item.value == En.Cancel_Deal) ? <></> :
                                //                     ((!statusDetails?.transactionDetail) && !(statusDetails?.transactionDetail?._id )&& item.value == En.Raise_Dispute) ? <></> :
                                //                         <>{CustomStatusBtn(item, false)}</>
                                //     }
                                // </>
                            )}
                        </View>
                    // { ((transDetail && transDetail?.transaction_status == 'completed') ) &&
                }
            </>

        )
    }

    // const id = offerDetail.userId == userId ? otherUserDetail?._id : userId
    return (
        <>
            <Components.CustomPopUp
                onHardwareBackPress={closeAlert}
                onClickTouchOutside={closeAlert}
                scaleAnimationDialogAlert={showModal}
                HeaderTitle={modalData?.title}
                AlertMessageTitle={modalData?.message}
                leftBtnText={Titles.Decline}
                rightBtnText={Titles.Confirm}
                onPressLeftBtn={closeAlert}
                onPressRightBtn={modalData?.onAccept}
            />

            <Components.RaiseDispute
                resetPopUp={clearRaiseADispute}
                loader={loadRaiseADipute}
                disputeTypes={disputeTypeArr}
                onHardwareBackPress={closeDisputeAlert}
                onClickTouchOutside={closeDisputeAlert}
                scaleAnimationDialogAlert={showRaiseDisputeModal}
                onPressCancelBtn={closeDisputeAlert}
                onPressSendBtn={onSubmitRaseDispute}
            />
            {/* {showAlertModal()} */}
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.innerContainer}>

                        {/* <Text style={{ ...TextStyles.large, ...styles.header }}>{En.Deal_Details}</Text> */}
                        <View style={{ gap: 15, marginTop: 15 }}>


                            <View style={{ gap: moderateScale(10) }}>
                                {chatStatus === 'pending' &&
                                    <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{En.Actions}</Text>

                                }

                                {statusButtons()}
                            </View>

                            {/* MARK: Title */}

                            <View style={{ gap: 2 }}>
                                <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{`${En.tradeId}`}
                                </Text>
                                <Text
                                    style={{ ...TextStyles.small, ...styles.textDarkGray, justifyContent: 'center', alignItems: 'center' }}
                                    onLongPress={() => copyText(tradeDetail?.chatExchangeId)}
                                >{`${tradeDetail?.chatExchangeId}`} <Image source={ImagePath.copy} style={{ height: scale(12), width: scale(15) }} resizeMode='contain' /></Text>

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
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>
                                        {`${parseFloat(tradeDetail?.sellingQuantity).toFixed(8).replace(/\.0+$/, "") || ''} ${offerDetail?.symbol?.toUpperCase()}`}
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
                                <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{`${currencySymbol} ${formatNumberToFixed(sellDealPrice, 2) || ''}`}</Text>

                                <Components.PricePercentText
                                    coinQty={tradeDetail?.sellingQuantity}
                                    selling_price={tradeDetail?.sellingAmount}
                                    coinName={offerDetail?.coin}
                                    textStyle={{ textAlign: 'left' }}
                                    percentage={offerDetail?.percentage}
                                    currencyName={offerDetail?.currency_name}
                                    currencySymbl={offerDetail?.currency_symbol}
                                />



                            </View>


                            <View style={{ gap: moderateScale(10) }}>
                                <Text style={{ ...TextStyles.medium, ...styles.subheaders, }}>{En.Payment_Method}</Text>
                                {paymentMetodVw()}
                            </View>


                            {/* { userData?.offer_status !== 'created'&&
                            <View style={{ gap: moderateScale(10) }}>
                         
                                <Text style={{ ...TextStyles.medium, ...styles.subheaders }}>{En.Actions}</Text>
                             
                               { statusButtons()}
                            </View>
                        } */}
                        </View>

                    </View>
                </ScrollView>
                {loading && <Components.CustomLoader />}

            </View>
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',

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
        color: Colors.darkGrayTxt,
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
    },
});

//make this component available to the app
export default UserDetailVw;
