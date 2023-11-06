//import liraries
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, StatusBar, ImageBackground, Alert, Clipboard, ToastAndroid, Keyboard, ActivityIndicator, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { height, moderateScale, moderateScaleVertical, scale, textScale, width } from '../../../Styles/responsiveSize';
import Colors from '../../../Colors/Colors';
import { AppFonts, En, ImageEnum, ImagePath, Titles } from '../../../Constants';
import { CommonStyles, TextStyles } from '../../../Styles/ComnStyle';
import UserDetailVw from '../../../Components/ChatComonents/UserDetailVw';
import { Actions, Bubble, Composer, GiftedChat, InputToolbar, Send, SystemMessage } from 'react-native-gifted-chat';
import * as Components from "../../../Components/indexx";
import moment from 'moment';
import { IMAGE_URl } from '../../../Constants/Urls';
import socketServices from '../../../Services/scoketService';
import Action from '../../../Redux/Actions';
import { currencySymbol, danger, delayed, formatNumberToFixed, showAlertMessage, success, warning } from '../../../Utils/helperFunctions';
import { useSelector } from 'react-redux';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as DocumentPicker from 'react-native-document-picker';
import { openGallery } from '../../../Utils/cameraFunction';
import { defaultMessage, disputeMessage } from '../../../Constants/En';
import { number } from 'prop-types';
import Lightbox from 'react-native-lightbox';
import { CountdownTimer, ShowCounter, useCountdown } from '../../../Utils/CountDown';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatStatusType, MessageType, TransactionStatusType } from '../../../Constants/Enum';
import { appendNewMessageInChatList, appendNewMessageInChatListLocally } from '../../../Utils/ChatHelper';
import RenderBubble from '../../../Components/ChatComonents/RenderBubble';
import RenderSystemMessage from '../../../Components/ChatComonents/RenderSystemMessage';
import KeyboardSpacer from '../../../Components/ChatComonents/KeyboardSpacer';
// create a component
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';


export const RenderSend = ({ props, onSend, selectedFile }) => {
    // console.log('renderSend  props are : --', props, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    return (
        // <View style={{ marginRight: moderateScale(10), justifyContent:'center',alignItems:'center',backgroundColor:'red' }}>
        <Send {...props}
        // disabled={false}
        >
            {
                !props.text && selectedFile ?
                    <Pressable
                        style={{ marginRight: moderateScale(10) }}
                        onPress={async () => onSend()}
                    >
                        <Image style={{ height: scale(28), width: scale(28), marginBottom: moderateScale(0) }} source={ImagePath.send} />

                    </Pressable>
                    :
                    <Image style={{ height: scale(28), width: scale(28), alignSelf: 'center', marginRight: moderateScale(10) }} source={ImagePath.send} />

            }
        </Send>
        // </View>
    );
};

const Chat = ({ navigation, route }) => {
    const lastScrnData = route?.params
    const insets = useSafeAreaInsets();
    // console.log('lastScrn Data from chats', lastScrnData)
    const [isShowDetail, setShowDetail] = useState(false)
    const [messages, setMessages] = useState([])
    const [cusxtomTet, setCustomText] = useState('')
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPageNo, setCurrentPage] = useState(1)
    const [refreshing, setRefreshing] = React.useState(false);
    const [offerDetail, setOfferDetail] = useState(undefined)
    const [tradeDetails, setTradeDetails] = useState('')

    const [offerUserDetail, setOfferUserDetail] = useState(undefined)
    const [messageSenderDetail, setMessageSenderDetail] = useState(undefined)

    const [enableLoader, setEnableLoader] = useState(true)

    const [isLoadMore, setIsLoadMore] = useState(false)
    const [isMoreMessagesAvailable, setIsMoreMessagesAvailable] = useState(false)
    // MARK: --- Message send Stats

    const [isAttachImage, setIsAttachImage] = useState(false);
    const [isAttachFile, setIsAttachFile] = useState(false);
    const [imagePath, setImagePath] = useState('');
    const [filePath, setFilePath] = useState('');
    const [selectedFileData, setSelectedFileData] = useState(undefined);
    const [statusDetails, setStatusDetails] = useState(undefined);

    const [inputText, setInputText] = useState(''); // State to track input text
    const [isTimeOut, setIsTimeOut] = useState(undefined)
    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    const [selectedMessage, setSelectedMessage] = useState('')
    const [fileVisible, setFileVisible] = useState(false);


    const homeRedux = useSelector((state) => state?.homeReducer)
    // const allCoinsList = homeRedux?.allCoinsList
    const disputeTypeArr = homeRedux?.disputeTypes
    const userType = (offerDetail?.userId !== myProfileDetail?._id) ? 'buyer' : 'seller'
    // let anotherUserDetail = {}
    // let tradeDetail = {}

    // console.log("myProfileDetail is : --  ", myProfileDetail)
    // const [days, hours, minutes, seconds] = useCountdown(new Date(dealStartTime).getTime() + (60 * 600 * 1000));
    useFocusEffect( //()=>{
        React.useCallback(() => {
            // socketServices.removeListener('message')
            socketServices.on('message', getMessageFromSocket)
            socketServices.on('transaction_response', updateStatusDetail)
            socketServices.on('transactionreceived_response', updateStatusDetail)
            socketServices.on('cancelDeal_response', updateStatusDetail)
            socketServices.on('RaiseADispute_response', updateStatusDetail)
            socketServices.on('initiateDeal_response', onReInitiateDeal)
            // socketServices.on('SeenMessage_response', seenAllMessagesByOtherUser)

            console.log("useCallback useCallback")

            return () => removeObservers()
        }, [statusDetails])
    );

    const removeObservers = () => {
        socketServices.removeListener('message')
        socketServices.removeListener('transaction_response')
        socketServices.removeListener('transactionreceived_response')
        socketServices.removeListener('cancelDeal_response')
        socketServices.removeListener('RaiseADispute_response')
        socketServices.removeListener('initiateDeal_response')

    }

    const updateStatusDetail = (data) => {
        console.log('socket respons updateStatusDetail from socket listner is : ----', data)
        // setStatusDetails(data)
        setEnableLoader(false)
        loadMesageHistory(true)
    }

    const onReInitiateDeal = (data) => {
        console.log('initiateDeal_response is : ----', data)
        // Alert.alert('initiateDeal_response')
        setIsTimeOut(undefined)
        const chatDtl = statusDetails.chatDetails
        const statusDet = { ...statusDetails, chatDetails: { ...chatDtl, timerStart: gmtToLocale(new Date().getTime), isTimeOut: false, isCanceled: false } }
        setStatusDetails(statusDet)
        loadMesageHistory(true)
    }
    console.log('disputeTypeArr disputeTypeArr disputeTypeArr:-----', disputeTypeArr)

    useEffect(() => {
        setEnableLoader(true)
        if (Object.keys(disputeTypeArr).length == 0) {
            getDisputeTitles()
        }
        loadMesageHistory()
    }, [currentPageNo])

    // MARK:---- Show hide drower detail
    async function onPressShowDetail() {
        setShowDetail(!isShowDetail)
    }

    // MARK:---- Load earlier messages from server
    const onReachEnd = () => {
        console.log('onReachEnd');
        if (currentPageNo < totalPages) {
            setIsLoadMore(true)
            setEnableLoader(true)
            setCurrentPage(currentPageNo + 1)

        }

    }

    const _pickDocument = async () => {

        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
                copyTo: 'documentDirectory',
                mode: 'import',
                allowMultiSelection: false,
            });
            setSelectedFileData(result[0])
            console.log('File selectedFile', result[0]);
            const fileUri = result[0].fileCopyUri;
            if (!fileUri) {
                console.log('File URI is undefined or null');
                return;
            }
            if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
                console.log('selected file is setIsAttachImage', fileUri)

                setImagePath(fileUri);
                setIsAttachImage(true);

            } else {
                console.log('selected file is setIsAttachFile', fileUri)
                // selectedFileData(selectedFile)
                setFilePath(fileUri);
                setIsAttachFile(true);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled file picker');
            } else {
                console.log('DocumentPicker err => ', err);
                throw err;
            }
        }
    };

    const getDisputeTitles = () => {
        setLoading(true);
        Action.getDiputeTypes().then((res) => {
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
    // MARK:---- Load messages from server
    const loadMesageHistory = (refresh = false) => {
        let query = `?pageNumber=${currentPageNo}&pageLimit=${10}`
        console.log("loadMesageHistory query : --- ", query);
        setLoading(currentPageNo == 1 && enableLoader)
        setIsLoadMore(currentPageNo > 1 && enableLoader)
        const paylod = { chatexchange: lastScrnData?.chatExchangeId, refresh_chats: refresh }
        Action.getChatMessageHistory(query, paylod)
            .then((res) => {
                const messageData = res?.data?.chats
                // const senderData = another_user_details
                if (!refresh) {///!refresh
                    if (currentPageNo == 1) {
                        setMessages([])
                    }
                    messageData.map((mapData, index) => {
                        const sender = mapData?.sender_details[0]
                        var extension = mapData?.file?.split('.').pop();
                        const mess = appendNewMessageInChatList(mapData, sender)
                        if (isLoadMore) {
                            setMessages(previousMessages =>
                                GiftedChat.prepend(previousMessages, mess),
                            )
                        } else {
                            setMessages(previousMessages =>
                                GiftedChat.append(previousMessages, mess),
                            )
                        }
                    })
                }

                let msg = res?.message
                console.log("all transaction msg is", msg);

                setStatusDetails(res?.data?.statusDetails)
                const ofrdtl = res?.data?.offerDetails.length > 0 ? res?.data?.offerDetails[0] : ''
                setOfferDetail(ofrdtl)
                setTradeDetails(res?.data?.tradeDetails)
                setOfferUserDetail(res?.data?.userDetails)
                setMessageSenderDetail(res?.data?.another_user_details)

                setEnableLoader(false)
                setTotalPages(res?.data?.totalPages)
                setIsMoreMessagesAvailable((messageData?.length < 5) ? false : true)
                setLoading(false);
                setRefreshing(false);
                setIsLoadMore(false)

                // showAlertMessage((res?.error) && (res?.error), warning)
            })
            .catch((error) => {
                console.log("catch error in loadMesageHistory is :---- ", error);
                setLoading(false);
                setRefreshing(false);
                setIsLoadMore(false)
                showAlertMessage(error?.error, danger)
            });
    }

    // MARK:---- On press Send Message 
    const onSend = useCallback(async (messages = [messages]) => {

        let serverFileUrl = ''
        if (isAttachFile || isAttachImage) {
            const formData = new FormData();
            if (selectedFileData) {
                setLoading(true)
                formData.append("file", {
                    uri: selectedFileData?.fileCopyUri,
                    name: selectedFileData?.name,//`${name.split(" ").join("_") + "_" + new Date().getTime()}.jpg`,
                    type: selectedFileData?.type,
                });
            } else {
                setLoading(false)
                // return


            }
            console.log("form data file is ", formData?._parts[0].file)
            let header = {
                "Content-Type": "multipart/form-data",
            };
            Action.updloadFile(formData, header).then(async (res) => {
                console.log("upload profile response is success res", res)
                serverFileUrl = res?.data ? res.data : ''
                await checkFileType(messages, serverFileUrl)
                showAlertMessage((res?.message) ? (res?.message) : (res?.error), alertType = (res?.error) ? danger : success)
                setLoading(false);
            })
                .catch((error) => {
                    console.log("catch error in upload profile respons", error);
                    const errMsg = error?.message ? error?.message : error?.error
                    showAlertMessage(errMsg, alertType = danger)
                    setLoading(false);
                });
            console.log('uploads uploads uploads uploads : -0--- ')

        } else {
            checkFileType(messages)
        }
    },
        [filePath, imagePath, isAttachFile, isAttachImage, messageSenderDetail, tradeDetails, statusDetails],
    );

    // MARK:---- checkFileType

    const checkFileType = async (messages, serverFileUrl) => {
        // Alert.alert(JSON.stringify(messages, serverFileUrl))
        const [messageToSend] = messages;
        if (isAttachImage) {

            const files = { filePath: filePath, image: imagePath }
            const mess = appendNewMessageInChatListLocally(messageToSend, files, myProfileDetail)
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, mess),);
            await sendMessagetoSocket(messageToSend, serverFileUrl)
            setSelectedFileData(undefined)
            setImagePath('');
            setIsAttachImage(false);
        } else if (isAttachFile) {
            const files = { filePath: filePath, image: imagePath }
            const mess = appendNewMessageInChatListLocally(messageToSend, files, myProfileDetail)
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, mess),
            );
            await sendMessagetoSocket(messageToSend, serverFileUrl)
            setFilePath('');
            setIsAttachFile(false);
        } else {
            const files = { filePath: filePath, image: imagePath }
            const mess = appendNewMessageInChatListLocally(messageToSend, files, myProfileDetail)
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, mess),);
            // setMessages(previousMessages =>
            //     GiftedChat.append(previousMessages, messages),
            //     await sendMessagetoSocket(messages, serverFileUrl)
            // );
            await sendMessagetoSocket(messageToSend, serverFileUrl)
        }
    }



    // MARK : -- Send Message to socket
    const sendMessagetoSocket = async (data, fileUri) => {
        const dataM = data
        const file = isAttachImage ? fileUri : isAttachFile ? fileUri : ''

        console.log('setMessageSenderDetail sendMessagetoSocket : =--- ', messageSenderDetail);

        let messageData = {
            chatex: tradeDetails?.chatExchangeId,
            userId: messageSenderDetail?._id,//ReciverId
            message: dataM?.text,
            file: file?.fileName,
            offerId: offerDetail?._id, // offerId
            message_type: ''
        }

        // console.log('gifted storage message are : -- ', data)
        console.log('message sending data is : -- ', messageData)

        socketServices.socket.emit("message", messageData, function (response) {
            console.log(response, "message sent ");
        });
    }

    // MARK : -- Get Messages from Socket
    const getMessageFromSocket = (messageData, sender = messageSenderDetail) => {
        console.log('getMessageFromSocket getMessageFromSocket sender : -----', sender)

        console.log('getMessageFromSocket getMessageFromSocket messageData : -----', messageData)

        if (messageData?.text || messageData?.file) {
            if (messageData?.chatExchangeId == statusDetails?.chatDetails?._id) {


                const message = appendNewMessageInChatList(messageData, sender)
                setMessages(previousMessages =>
                    GiftedChat.append(previousMessages, message),
                )
            }
        }
    }
    const gmtToLocale = (time, format) => {
        var stillUtc = moment.utc(time).toDate();
        return local = moment(stillUtc).local().format(format);
    }
    const getTimerUpdate = (data) => {
        const toatlTime = data.reduce((total, currentValue) => { return total + currentValue }, 0)
        const wait = delayed()
        if (toatlTime <= 0 && !isTimeOut && statusDetails?.chatDetails?.isCanceled == false && !(statusDetails?.transactionDetail?._id)) {
            console.log(' Your deal has been canceled before send message : ----');
            const data = {
                chatexchangeId: statusDetails?.chatDetails?._id,
                isTimeOut: true
            }
            // const result = response?.result
            const chatDtl = statusDetails?.chatDetails
            const statusDet = { ...statusDetails, chatDetails: { ...chatDtl, isTimeOut: true, isCanceled: true } }
            setStatusDetails(statusDet)
            setIsTimeOut(true)
            loadMesageHistory(true)
            const wait = delayed()
            if (messageSenderDetail?.isOnline) {


                socketServices.socket.emit("cancelDeal", data, function (response) {
                    const result = response?.result //chatDetails   offerDetails
                    sendSystemMessageToSocket(MessageType.cancelDeal, 'Your deal has been canceled due to time out')
                    const messg = {
                        _id: Math.random(),
                        createdAt: new Date(),
                        text: 'Your deal has been canceled due to time out',
                        isDefault: false,
                        message_type: MessageType.cancelDeal,
                    }
                    const mess = appendNewMessageInChatListLocally(messg, '', myProfileDetail)
                    setMessages(previousMessages =>
                        GiftedChat.append(previousMessages, mess),
                    );
                    loadMesageHistory(true)
                });
            } else {
                socketServices.socket.emit("cancelDeal", data, function (response) {
                    sendSystemMessageToSocket(MessageType.cancelDeal, 'Your deal has been canceled due to time out')
                    const messg = {
                        _id: Math.random(),
                        createdAt: new Date(),
                        text: 'Your deal has been canceled due to time out',
                        isDefault: false,
                        message_type: MessageType.cancelDeal,
                    }
                    const mess = appendNewMessageInChatListLocally(messg, '', myProfileDetail)
                    setMessages(previousMessages =>
                        GiftedChat.append(previousMessages, mess),
                    );
                    loadMesageHistory(true)
                });
            }
            // }
        }
    }

    const reInitiateDeal = () => {
        // showAlertMessage('reInitiateDeal reInitiateDeal reInitiateDeal')
        if (!statusDetails?.chatExchange && messageSenderDetail && !messageSenderDetail?._id) {
            showAlertMessage('No chat Id or usrr id found')
            return
        }
        const data = {
            chatexchangeId: statusDetails?.chatDetails?._id,
            userId: messageSenderDetail?._id
        }
        console.log("reInitiateDeal reInitiateDeal reInitiateDeal", data);
        // return
        socketServices.socket.emit("initiateDeal", data, function (response) {
            console.log(response, "initiateDeal emit message sent ");
            sendSystemMessageToSocket(MessageType.initiateDeal, 'Your deal has been been restarted')
            // const result = response?.result
            // const detail = { ...statusDetails, timerStart: gmtToLocale(new Date().getTime()), isTimeOut: false, isCanceled: false }
            // statusDetails(detail)
            // Alert.alert(JSON.stringify(response))
            setIsTimeOut(undefined)
            const chatDtl = statusDetails.chatDetails
            const statusDet = { ...statusDetails, chatDetails: { ...chatDtl, timerStart: gmtToLocale(new Date().getTime), isTimeOut: false, isCanceled: false } }
            setStatusDetails(statusDet)
            // loadMesageHistory(true)

            const messg = {
                _id: Math.random(),
                createdAt: new Date(),
                text: 'Your deal has been been restarted',
                isDefault: false,
                message_type: MessageType.initiateDeal,
            }
            const mess = appendNewMessageInChatListLocally(messg, '', myProfileDetail)
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, mess),
            );
            loadMesageHistory(true)
            setIsTimeOut(undefined)

        });
        // socketServices.emit('initiateDeal')
        // sendSystemMessageToSocket('initiateDeal', 'Your deal has been restarted by Seller')

    }

    const sendSystemMessageToSocket = (type, message) => {

        let messageData = {
            userId: messageSenderDetail?._id,//ReciverId
            message: message,
            file: '',
            offerId: offerDetail?._id, // offerId
            message_type: type,
            chatex: statusDetails?.chatDetails?._id
        }
        console.log('message sending data is : -- ', messageData)
        socketServices.emit('message', messageData)

    }
    // MARK:---- Load user Detail

    const UserName = () => {
        let lastSeen = moment(messageSenderDetail?.lastSeen).startOf('min').fromNow();//.format('Do, MMMM YYYY / HH.mm')
        const transDetail = statusDetails?.transactionDetail
        const chatStatus = statusDetails?.chatDetails?.chatStatus
        console.log('messageSenderDetail messageSenderDetail userName : ---', messageSenderDetail);
        return (
            <View style={{ overflow: 'hidden', paddingBottom: 10 }}>
                <View style={styles.userDetail}>
                    <View style={styles.userDetailCont}>
                        <View style={{ flexDirection: 'row', gap: moderateScale(8), alignItems: 'center', paddingVertical: 10, paddingHorizontal: moderateScale(20) }}>
                            {/* <Components.LoaderImage
                                imageUrl={messageSenderDetail?.profilePic.includes('http') ? messageSenderDetail?.profilePic :`${IMAGE_URl}${messageSenderDetail?.profilePic}`}
                                indicatorSize='small'
                                style={styles.userImage}
                            /> */}
                            <Components.LoaderImage
                                imageUrl={IMAGE_URl + messageSenderDetail?.profilePic}
                                indicatorSize='small'
                                style={styles.userImage}
                            />

                            <View style={{ gap: 2 }}>
                                <Text
                                    style={{ ...TextStyles.large, ...styles.userName }} >
                                    {`${messageSenderDetail?.firstName || ''} ${messageSenderDetail?.lastName || ''}`}
                                </Text>

                                <View style={{ flexDirection: 'row', gap: moderateScale(1), alignItems: 'center' }}>
                                    <View style={{ height: moderateScale(10), width: moderateScale(10), borderRadius: 100, backgroundColor: messageSenderDetail?.isOnline == true ? Colors.app_Green : messageSenderDetail?.isOnline == false ? Colors.app_Red : Colors.selectedBg }} />
                                    <Text style={{ ...TextStyles.small, ...styles.userDisc }}> {messageSenderDetail?.isOnline ? En.online : lastSeen}</Text>
                                </View>

                            </View>
                            <View style={{ position: 'absolute', right: 20, alignItems: 'center' }}>

                                {((!isTimeOut && isTimeOut == undefined) && (statusDetails !== undefined && offerDetail !== undefined) && (!statusDetails?.chatDetails?.isTimeOut) && statusDetails?.chatDetails?.isCanceled == false && offerDetail !== undefined && transDetail.buyer_status !== 'paid' && (!transDetail._id) && (statusDetails?.chatDetails?.chatStatus !== ChatStatusType.completed || ((transDetail) && transDetail?.transaction_status !== TransactionStatusType.completed))) &&
                                    <>
                                        <Text style={{ ...TextStyles.regular, fontSize: textScale(12), color: Colors.text_red_dark }}>
                                            {/* (statusDetails?.chatDetails?.isTimeOut !== undefined && !statusDetails?.chatDetails?.isTimeOut && statusDetails?.chatDetails?.isCanceled == false) ? */}
                                            {"Trade ends in "}
                                        </Text>
                                        <CountdownTimer
                                            targetDate={new Date(gmtToLocale(statusDetails?.chatDetails?.timerStart)).getTime() + 30 * 60 * 1000}//(30 * 60 * 1000)
                                            countDownTimer={(data) => {
                                                // const toatlTime = data.reduce((total, currentValue) => { return total + currentValue; }, 0)
                                                getTimerUpdate(data)
                                            }
                                            }
                                        />
                                    </>

                                }

                                {

                                    (statusDetails != undefined && offerDetail !== undefined && transDetail.buyer_status !== 'paid' && ((statusDetails?.chatDetails?.isTimeOut && statusDetails?.chatDetails?.isCanceled) || (offerDetail?.offer_status !== 'successful' || ((transDetail) && transDetail?.transaction_status !== 'completed')))) &&
                                    <>
                                        {(userType == 'seller') ?

                                            ((statusDetails?.chatDetails?.isTimeOut) && statusDetails?.chatDetails?.isCanceled && (!statusDetails?.chatDetails?.isReinitiated) && ((offerDetail?.offer_status !== 'successful'))) &&

                                            <TouchableOpacity
                                                style={{ borderColor: Colors.gradiantDwn, borderRadius: 5, borderWidth: 1.2, paddingHorizontal: 6, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' }}
                                                onPress={reInitiateDeal}

                                            >
                                                <Text style={{ ...TextStyles.medium, fontSize: textScale(16), color: Colors.gradiantDwn }}>
                                                    {Titles.Reinitiate}
                                                </Text>
                                            </TouchableOpacity>
                                            :

                                            ((statusDetails?.chatDetails?.isTimeOut) && statusDetails?.chatDetails?.isCanceled && (offerDetail?.offer_status !== 'successful')) &&

                                            <Text style={{ ...TextStyles.bold, fontSize: textScale(12), color: Colors.text_red_dark }}>
                                                {(statusDetails?.chatDetails?.isCanceled && statusDetails?.chatDetails?.isTimeOut) ? "Trade time Out" : ''}
                                            </Text>
                                        }
                                    </>
                                }
                            </View>
                        </View>

                        {
                            !isShowDetail ? <View style={{ height: 1.2, backgroundColor: Colors.seprator, marginTop: 0 }} /> :

                                <View style={{ height: height / 1.6 }}>
                                    <UserDetailVw
                                        navigation={navigation}
                                        userData={offerDetail}
                                        tradeDetail={tradeDetails}
                                        userId={myProfileDetail?._id}
                                        statusDetail={statusDetails}
                                        otherUserDetail={messageSenderDetail}
                                        transaction={statusDetails?.transactionDetail}
                                        updateChat={() => updateStatusDetail()}
                                        sendNewMessage={(res) => {
                                            console.log('sendNewMessage getMessageFromSocket :----', res)
                                            getMessageFromSocket(res, myProfileDetail)
                                        }}
                                    // updateChat={(data)=>setStatusDetails(data)}
                                    />
                                </View>
                        }

                        <View style={{ overflow: 'hidden', justifyContent: 'center', marginBottom: 0, }}>
                            <GestureRecognizer
                                onSwipeUp={() => setShowDetail(false)}
                                onSwipeDown={() => setShowDetail(true)}
                            >
                                <TouchableHighlight underlayColor={Colors.transparent}
                                    onPress={() => onPressShowDetail()}>
                                    <View

                                        style={{
                                            flexDirection: 'row', justifyContent: !isShowDetail ? 'space-between' : 'center', alignItems: 'center',
                                            paddingHorizontal: moderateScale(20), marginVertical: moderateScaleVertical(13)
                                        }}>

                                        {
                                            !isShowDetail &&
                                            <>
                                                {/* <Text style={{ ...TextStyles.medium, color: Colors.text_DarkGray }}> {En.Deal_Details}</Text> */}
                                                {((chatStatus === ChatStatusType.canceled || statusDetails?.chatDetails?.isCanceled === true) || (chatStatus === ChatStatusType.disputed) || (chatStatus === ChatStatusType.completed || ((transDetail) && transDetail?.transaction_status === TransactionStatusType.completed))) ?
                                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                        <Text style={{ ...TextStyles.medium, color: (chatStatus === ChatStatusType.canceled || statusDetails?.chatDetails?.isCanceled) ? Colors.text_red_dark : (chatStatus === ChatStatusType.completed || ((transDetail) && transDetail?.transaction_status === TransactionStatusType.completed)) ? Colors.text_green : Colors.text_Yellow }}>
                                                            {
                                                                (chatStatus === ChatStatusType.canceled || statusDetails?.chatDetails?.isCanceled === true) ? "Trade canceled" :
                                                                    (chatStatus === ChatStatusType.completed || ((transDetail) && transDetail?.transaction_status === 'completed')) ? "Trade completed sucessfully " :
                                                                        (chatStatus === ChatStatusType.disputed || ((transDetail) && transDetail?.transaction_status !== 'completed')) ? "Trade under Dispute" : ""

                                                            }

                                                        </Text>
                                                    </View> :
                                                    <Text style={{ ...TextStyles.medium, color: Colors.text_DarkGray }}> {En.Deal_Details}</Text>

                                                }

                                            </>

                                        }

                                        <Image source={isShowDetail ? ImagePath.arrow_up : ImagePath.arrow_down_light_thin} style={styles.dropDownImage} />
                                    </View>

                                </TouchableHighlight>
                            </GestureRecognizer>

                        </View>

                    </View>
                </View>
            </View>
        )
    }
    async function onPressGelery() {
        openGallery(onChangeImage, "Upload Attachment")
    }
    const onChangeImage = (key, value) => {
        const data = value?.uri
        const file = { fileCopyUri: data?.uri, name: data?.fileName, size: data?.fileSize, type: data?.type, uri: data?.uri }
        setSelectedFileData(file)
        setImagePath(data?.uri);
        setIsAttachImage(true);
    };
    const renderActions = useCallback((props) => {
        const transDetail = statusDetails?.transactionDetail
        const chatStatus = statusDetails?.chatDetails?.chatStatus// : offerDetail?.offer_status
        if (statusDetails?.chatDetails?.isCanceled === true || ((transDetail) && transDetail?.transaction_status === TransactionStatusType.completed) || chatStatus === ChatStatusType.completed) {
            return (<></>)
        }
        return (
            <>
                <Actions
                    options={{
                        ['Gallery']:

                            async (props) => {
                                await onPressGelery()
                            },
                        ['Document']:
                            async (props) => {

                                await _pickDocument()
                            },

                        Cancel: (props) => { console.log("Cancel") }
                    }}
                    icon={() => (
                        <Image source={ImagePath.attacthment}
                            style={{ height: 25, width: 25 }}
                        />
                    )}
                    onSend={args => {
                        Alert.alert('fdf;lsdk;lsfgsfs'),
                            console.log("ardumens on send is : ----  ", args)
                    }
                    }
                    {...props}
                    wrapperStyle={{ paddingVertical: 0 }}
                    containerStyle={{ marginTop: 5 }}
                />
            </>
        )
    }, [])


    const renderChatFooter = useCallback(() => {
        if (imagePath) {
            return (
                <View style={styles.chatFooter}>
                    <View
                        style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
                    >
                        <ImageBackground style={{ height: scale(80), width: scale(75), alignItems: 'flex-end' }} resizeMode="cover" source={{ uri: imagePath }}>

                            <TouchableOpacity
                                onPress={() => {
                                    setImagePath('')
                                    setSelectedFileData(undefined)
                                }
                                }
                                // style={{ height: 20, width: 20, borderRadius: 10, overflow: 'hidden',backgroundColor:Colors.app_White }}
                                style={styles.buttonFooterChat}
                            >
                                <Image source={ImagePath.cancel}
                                    style={{ height: 12, width: 12 }}
                                    resizeMode='contain' />

                                {/* <Text style={styles.textFooterChat}>X</Text> */}
                            </TouchableOpacity>

                        </ImageBackground>

                        <View >
                            <View style={{ justifyContent: 'center' }} >
                                <Text style={{ ...TextStyles.small, color: Colors.text_Black, maxWidth: width / 1.4, }} numberOfLines={2}>{selectedFileData?.name}</Text>
                                <Text style={{ ...TextStyles.medium, fontSize: 15 }}>{selectedFileData?.name.split('.').pop().toUpperCase()}</Text>
                            </View>
                            <Text style={{ ...TextStyles.small, color: Colors.text_red_dark, }}>{En.OnlyOneItemSentAtTime}</Text>
                        </View>
                    </View>
                </View>
            );
        }
        if (filePath) {
            return (
                <View style={styles.chatFooter}>
                    <Components.InChatFileTransfer
                        filePath={filePath}
                        onPressDelete={() => {
                            setFilePath('')
                            setSelectedFileData(undefined)
                        }
                        }
                    />
                </View>
            );
        }
        return null;//(<View style={{height:10}}/>)
    }, [filePath, imagePath]);


    const renderSeen = (props) => {

        return (
            <View>
                <Image
                    style={{ height: 15, width: 15 }}
                    source={ImagePath.msg_seen}
                    resizeMode='contain'
                />

            </View>
        )
    }
    const renderCustomView = (pr) => {
        return (
            <>
                {/* <Components.CustomLoader 
containerStyle = {styles.imageLoader}
/> */}
            </>
        );
    };


    const renderMessageImage = (props) => {
        // console.log('renderMessageImage renderMessageImage renderMessageImage', props)
        
        return (
            <View

                style={{
                    borderRadius: 13,
                    height: width / 2,
                    maxHeight:width / 2,
                    margin: 3,
                    maxWidth:width / 1.8,
                    minWidth:width / 2,
                    // width: width / 1.8,
                    overflow: 'hidden'
                }}>

                <Lightbox
                    activeProps={{ width: '100%', height: '100%' }}
                    underlayColor={Colors.app_White}
                >
                
                    <Components.LoaderImage
                        containerStyle={{
                            borderRadius: 13,
                            backgroundColor: Colors.app_Bg,
                            height:'100%'

                        }}
                        style={{
                            height: '100%',
                            margin: 3,
                            width: '100%'
                        }}
                        resizeMode={ImageEnum.contain}
                        imageUrl={props.currentMessage.image}
                    />
                </Lightbox>
            </View>
        );
    };




    const renderToolbar = (props) => {
        return (
            // <View>
            <InputToolbar
                // containerStyle={{paddingVertical:20}}
                containerStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}
                // primaryStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingRight: 10, paddingLeft: 20, backgroundColor:'red' }}
                // accessoryStyle = {{paddingVertical:20}}

                primaryStyle={{ alignItems: 'center', backgroundColor: Colors.app_Bg, paddingTop: moderateScaleVertical(Platform.OS === 'ios' ? 0 : 3), }}
                {...props}
            />
            // </View>
        );
    }
    const renderComposer = (props) => (
        <Composer
            {...props}
            textInputProps={{
                onFocus: () => setShowDetail(false)
            }}
            placeholder='Text message ...'
            textInputStyle={{
                alignContent: 'center',
                backgroundColor: Colors.app_White,
                borderRadius: moderateScale(20),
                paddingHorizontal: moderateScale(12),
                paddingTop: moderateScaleVertical(Platform.OS === 'ios' ? 14 : 8),
                marginRight: moderateScale(8),
                color: Colors.text_Black,
                // fontFamily: AppFonts.regular,
                // fontSize: textScale(16),
                // height:'100%',
                // height:60

                // backgroundColor:'red',
            }}
            //   disableComposer={true}
            keyboardAppearance='light'
        //   composerHeight={45}
        />
    );
    const renderAccessory = (props) => {
        return true ?
            <View style={{
                width: width,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
            }}>
                {/* <Text>test</Text> */}
            </View> : null

    }
    const renderStatusBar = (props) => {
        const transDetail = statusDetails?.transactionDetail
        const chatStatus = statusDetails?.chatDetails?.isCanceled ? 'canceled' : offerDetail?.offer_status



        return (
            <InputToolbar
                {...props}

                // containerStyle={{ minHeight: 50, flexDirection: 'row', alignItems:'center',}}
                primaryStyle={{ flex: 0, height: 0, justifyContent: 'center', alignItems: 'center', paddingRight: 10, paddingLeft: 20 }}
                renderComposer={() => (
                    <></>
                    // <View style={{ flex: 1, borderRadius: 20, paddingHorizontal: 0, paddingVertical: 5, alignItems: 'center',backgroundColor:'red',height: }}>

                    //     <Text style={{ ...TextStyles.medium, color: (offerDetail?.offer_status === 'canceled' || statusDetails?.chatDetails?.isCanceled) ? Colors.text_red_dark : (offerDetail?.offer_status === 'successful' || ((transDetail) && transDetail?.transaction_status === 'completed')) ? Colors.text_green : Colors.text_Yellow }}>
                    //         {
                    //             (chatStatus === 'canceled' || statusDetails?.chatDetails?.isCanceled === true) ? "Deal canceled" :
                    //                 (chatStatus === 'successful' || ((transDetail) && transDetail?.transaction_status === 'completed')) ? "Deal completed sucessfully " : ""
                    //         }

                    //     </Text>
                    // </View>
                )}
            />
        );
    }

    const RenderAvatar = (props) => {
        const { position, currentMessage } = props;
        // console.log("CustomMessage props are : -=-",props)
        // Check if the message should hide the user image

        const hideUserImage = currentMessage.isDefault && currentMessage.isDefault == true//currentMessage.hideUserImage === true;
        const userData = currentMessage?.user
        return (
            !hideUserImage ?
                <>
                    <Components.LoaderImage
                        imageUrl={(userData?.avatar) ? userData.avatar : ''}
                        style={{ height: scale(40), width: scale(40), borderRadius: 5, marginBottom: 4 }}
                        resizeMode={ImageEnum.cover}
                    />

                </> : <></>
        )
    };

    const renderLoadMoreHeader = () => {
        // console.log('rendelLodMoreHeader ',offerDetail)
        const payArr = offerDetail?.pay_details?.length > 0 ? offerDetail?.pay_details.map((item) => item?.name) : ''
        // console.log('payArr is : ---',payArr);
        if (loading) {
            return <></>
        }
        return (

            <View
                // style={[messages.length <= 2 && !Keyboard.isVisible() ? styles.absoluteOffer : null, { flex: 1, paddingHorizontal: moderateScale(10), gap: 20, }]}

                style={[{ flex: 1, paddingHorizontal: moderateScale(10), gap: 20, }]}
            >
                {isMoreMessagesAvailable ?
                    <View style={{ alignItems: 'center' }} >
                        <View style={{ borderRadius: 100, backgroundColor: Colors.darkSliver, alignItems: 'center', justifyContent: 'center' }}>
                            {isLoadMore &&
                                // <TouchableOpacity style={{ paddingHorizontal: moderateScale(20), paddingVertical: moderateScaleVertical(10), }}
                                //     onPress={onReachEnd}
                                // >
                                //     <Text style={{ ...TextStyles.btnTitle, color: Colors.text_White, fontSize: 15 }}>
                                //         Load More
                                //     </Text>

                                // </TouchableOpacity> :
                                <ActivityIndicator style={{ paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(10) }} size={'small'} color={'white'} />
                            }

                        </View>
                    </View> :
                    <View style={{ alignItems: 'center' }} >
                        {/* <Text style={{ alignSelf: 'center' }}>No more chat found</Text> */}
                    </View>
                }

                {offerDetail &&


                    <View style={{
                        alignItems: 'center', justifyContent: 'center', paddingHorizontal: moderateScale(10),
                        backgroundColor: Colors.opaqueBlue, paddingVertical: moderateScaleVertical(10), borderColor: Colors.app_Black, borderWidth: 1, borderRadius: 10
                    }}>
                        {(userType == 'buyer') ?
                            <Text style={{ ...styles.systemMessageText, marginBottom: moderateScaleVertical(12) }}>
                                1. <Text style={styles.higlighText}>{(offerUserDetail?.username || '').toString()}</Text> is selling you. <Text style={styles.higlighText}>{formatNumberToFixed(tradeDetails?.sellingQuantity) || '0'}</Text> <Text style={styles.higlighText}>{offerDetail?.coin || 'coin'}</Text>.{'\n'}
                                2. You must pay <Text style={styles.higlighText}>{`${offerDetail?.currency_symbol ?? ''} ${formatNumberToFixed(tradeDetails?.sellingAmount, 2) ?? ''}`}</Text> via <Text style={styles.higlighText} >{`${payArr.toString()}`}</Text>.{'\n'}
                                3. You will share your transaction details below.{'\n'}
                                4. When you have sent the money, please mark the trade as <Text style={styles.higlighText} >{`'Paid'`}</Text>.{'\n'}
                                5. (It really helps if you upload a screenshot or PDF as a receipt of payment too after sending a money.){'\n'}
                                6. During the if any problem you have an option to <Text style={styles.higlighText} >{`'Raise A Dispute'`}</Text>. Our team is available to fix it.{'\n'}
                                7. Then wait <Text style={styles.higlighText}>{offerUserDetail?.username || ''}</Text> to confirm they have received payment.{'\n'}
                                8. When they do they will release your <Text style={styles.higlighText}>{offerDetail?.symbol?.toUpperCase()} </Text>and the trade will be completed.{'\n'}
                            </Text>
                            :
                            <Text style={{ ...styles.systemMessageText, marginBottom: moderateScaleVertical(12) }}>
                                1. You are selling <Text style={styles.higlighText}>{formatNumberToFixed(tradeDetails?.sellingQuantity) || '0'}</Text> <Text style={styles.higlighText}>{offerDetail?.coin || 'coin'}</Text>. to <Text style={styles.higlighText}>{(messageSenderDetail?.username || '').toString()}</Text> {'\n'}
                                2.  <Text style={styles.higlighText}>{(messageSenderDetail?.username || '').toString()}</Text> can make a payment of <Text style={styles.higlighText}>{`${offerDetail?.currency_symbol ?? ''} ${formatNumberToFixed(tradeDetails?.sellingAmount, 2) ?? ''}`}</Text> via <Text style={styles.higlighText} >{`${payArr.toString()}`}</Text>.{'\n'}
                                3. You will share your transaction details below.{'\n'}
                                4. When you have recived the money, please mark the trade as <Text style={styles.higlighText} >{`'Release'`}</Text>.{'\n'}
                                5. (It really helps if you upload a screenshot or PDF as a receipt of payment too while recives a money.){'\n'}
                                6. During the if any problem you have an option to <Text style={styles.higlighText} >{`'Raise A Dispute'`}</Text>. Our team is available to fix it.{'\n'}
                                {/* 6. Then wait <Text style={styles.higlighText}>{offerUserDetail?.username || ''}</Text> to confirm they have received payment.{'\n'} */}
                                7. When they do they will release your <Text style={styles.higlighText}>{offerDetail?.symbol?.toUpperCase()} </Text>and the trade will be completed.{'\n'}
                            </Text>
                        }
                    </View>
                }
            </View>

        )

    };

    const handleBubbleLongPress = async (message) => {
        const messageText = message.text;
        Clipboard.setString(messageText);
    };

    const transDetail = statusDetails?.transactionDetail
    const chatStatus = statusDetails?.chatDetails?.chatStatus
    const isShowinput = ((!offerDetail || ((chatStatus === ChatStatusType.canceled || statusDetails?.chatDetails?.isCanceled === true) || chatStatus === ChatStatusType.completed || ((transDetail) && transDetail?.transaction_status === TransactionStatusType.completed))))

    // const systemMessageRender = React.useMemo((props) => <RenderSystemMessage props={props}
    //     userType={userType}
    //     offerDetail={offerDetail}
    //     messageSenderDetail={messageSenderDetail}
    //     tradeDetails={tradeDetails}
    // />, []);

    // const footer = React.useMemo( () => <Footer/>, [] );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_White }}>
            <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />

            <View style={styles.container}>
                <Components.BackBtnHeader
                    navigation={navigation}
                    isSowText={false}
                />
                {/* {userName()} */}
                <UserName />
                <Components.InChatViewFile
                    props={selectedMessage?.file?.url.includes('http') ? selectedMessage?.file?.url : IMAGE_URl + selectedMessage?.file?.url}
                    visible={fileVisible}
                    onClose={() => setFileVisible(false)}
                />
                <View style={styles.innerContainer}>
                    <GiftedChat
                        messages={messages}
                        showUserAvatar={true}
                        multiline={true}
                        keyboardShouldPersistTaps='never'
                        user={{
                            _id: myProfileDetail?._id,
                            name: `${myProfileDetail?.firstName} ${myProfileDetail?.name}`,
                            avatar: `${IMAGE_URl}${myProfileDetail?.profilePic}`,
                        }}
                        renderSend={(props) => (<RenderSend props={props} onSend={() => onSend()} selectedFile={selectedFileData} />)}
                        onSend={messages => onSend(messages)}
                        onLongPress={(context, message) => handleBubbleLongPress(message)}
                        // text={customText}
                        listViewProps={{
                            // contentContainerStyle: { flexGrow: 1, justifyContent: 'flex-end', marginBottom: 25, backgroundColor: Colors.transparent },
                            paddingHorizontal: moderateScale(5),
                            paddingBottom: moderateScale(5),
                            // marginBottom: !isShowinput ? 0 : - (insets.bottom + 40),

                            maintainVisibleContentPosition: {
                                minIndexForVisible: 0,
                                autoscrollToTopThreshold: 30
                            }
                        }}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
                        // renderSystemMessage={renderSystemMessage}
                        renderSystemMessage={(props) => (<RenderSystemMessage props={props}
                            userType={userType}
                            offerDetail={offerDetail}
                            messageSenderDetail={messageSenderDetail}
                            tradeDetails={tradeDetails}
                            myProfileDetail={myProfileDetail}
                        />)}
                        // renderSystemMessage={systemMessageRender}

                        renderLoadEarlier={renderLoadMoreHeader}
                        onInputTextChanged={text => setCustomText(text)}
                        renderAvatarOnTop={false}
                        loadEarlier={true}//isMoreMessagesAvailable
                        isLoadingEarlier={(loading && isLoadMore)}
                        onLoadEarlier={onReachEnd}
                        alwaysShowSend={((!offerDetail || (chatStatus === ChatStatusType.canceled || statusDetails?.chatDetails?.isCanceled === true || offerDetail?.offer_status === 'successful' || ((transDetail) && transDetail?.transaction_status === TransactionStatusType.completed)))) ? true : true}
                        renderActions={(props) => ((!offerDetail || (chatStatus === ChatStatusType.canceled || chatStatus === ChatStatusType.completed || ((transDetail) && transDetail?.transaction_status === TransactionStatusType.completed)))) ? renderActions(props) : renderActions(props)}
                        wrapInSafeArea={true}
                        renderChatFooter={renderChatFooter}
                        renderAvatar={(prop) => RenderAvatar(prop)}
                        infiniteScroll={true}
                        maxComposerHeight={moderateScale(60)}
                        minComposerHeight={Platform.OS === 'ios' ? moderateScale(45) : moderateScale(40)}
                        bottomOffset={insets.bottom - 15}
                        // bottomOffset={-20}
                        renderBubble={(props) => (<RenderBubble props={props} offerDetail={offerDetail} offerUserDetail={offerUserDetail} myProfileDetail={myProfileDetail} setSelectedMessage={(val) => setSelectedMessage(val)} setFileVisible={(val) => setFileVisible(true)} renderMessageImage={renderMessageImage} renderCustomView={renderCustomView} />)}
                        // renderAccessory={()=><View style={{height:20}}/>}
                        messagesContainerStyle={{}}
                        scrollToBottom
                        // renderBubble={renderBubble}
                        maxInputLength={10}
                        // accessoryStyle={{height: "auto",backgroundColor:'yellow',marginBottom:20}}
                        renderComposer={renderComposer}

                        renderInputToolbar={(props) => ((!offerDetail || ((chatStatus === ChatStatusType.canceled || statusDetails?.chatDetails?.isCanceled === true) || chatStatus === ChatStatusType.completed || ((transDetail) && transDetail?.transaction_status === TransactionStatusType.completed)))) ? renderToolbar(props) : renderToolbar(props)}
                    />
                    {/* <KeyboardSpacer/> */}
                </View>
            </View>
            {(loading && !isLoadMore) && <Components.CustomLoader />}
        </SafeAreaView>
    );

};
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.app_White
        // justifyContent: 'center',

    },
    innerContainer: {
        // flex: 1,
        // marginBottom: moderateScale(0),
        flex: 1,

    },
    userDetail: {
        backgroundColor: Colors.app_White, borderBottomEndRadius: 10, borderBottomStartRadius: 10,
        shadowColor: Colors.app_Black,
        shadowRadius: 3,
        shadowOpacity: 0.4,
        borderRadius: 4,
        shadowOffset: { height: 1, width: 1 },
        elevation: 5,
    },
    userDetailCont: {
        // paddingHorizontal: moderateScale(20),
        // flex: 1
    },

    userImage: {
        height: moderateScale(50), width: moderateScale(50), borderRadius: 8, backgroundColor: Colors.app_White
    },
    dropDownImage: {
        width: moderateScale(20), resizeMode: 'contain', height: moderateScale(22)
    }
    , userName: {
        fontSize: textScale(16),
    },
    userDisc: {
        color: Colors.text_DarkGray,
        marginRight: 0,
        textAlign: 'left',
        fontSize: textScale(12),
    }, sendContainer: {
        marginRight: 15,
    }, messageTextInput: {

    },
    chatFooter: {
        backgroundColor: Colors.gradiantOpaqeDown,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    }, buttonFooterChatImg: {
        height: 60,
        width: 60,
        // marginBottom:20,
    }, buttonFooterChat: {
        backgroundColor: Colors.app_Trans_White,
        borderRadius: 100,
        borderColor: Colors.app_Black,
        borderWidth: 1.2,
        marginRight: -5,
        marginTop: -5,
        height: 20, width: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }, textFooterChat: {
        height: 100,
        width: 100
    }, fileContainer: {
        flex: 1,
        marginVertical: 1,
        marginHorizontal: 0,
        paddingBottom: 5
    }, disputeText: {
        paddingHorizontal: 15,
        paddingVertical: 2,
        fontFamily: AppFonts.regular,
        fontSize: 15
    }, fileText: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontFamily: AppFonts.regular,
        fontSize: 15
    }, timeStyle: {
        fontFamily: AppFonts.regular,
        textAlign: 'right',
        fontSize: 10,
        marginRight: 10,
    }, imageLoader: {
        backgroundColor: Colors.transparent
    }, systemMessageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: '#e0e0e0',
    },
    systemMessageText: {
        ...TextStyles.regularMedium,
        color: Colors.text_Black,
        lineHeight: 20,
        letterSpacing: 0.5,
        fontSize: 13,
        // color: '#757575',
    },
    higlighText: {
        fontFamily: AppFonts.bold,
        color: Colors.text_Black,
        fontSize: 15
    },
    absoluteOffer: {
        position: 'relative', top: -height / 3.5
    }
});

//make this component available to the app
export default Chat;