import { Bubble } from 'react-native-gifted-chat';
import { AppFonts, Colors, ImagePath, En, } from '../../Constants';

import React from 'react';
import { Clipboard, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Alerts, En, ImageEnum, ImagePath, Titles } from '../../Constants';
// import { moderateScale, textScale, width } from '../../Styles/responsiveSize';
import { CommonStyles, TextStyles } from '../../Styles/ComnStyle';
import { moderateScale, width, height, textScale, moderateScaleVertical, scale } from '../../Styles/responsiveSize';

import moment from 'moment';
import { MessageType } from '../../Constants/Enum';

export const RenderSystemMessage = ({ props, messageSenderDetail,myProfileDetail, tradeDetails, offerDetail, userType }) => {
    const user = messageSenderDetail

    // const dealCancelUser = offerDetail?.userId == myProfileDetail?._id ? myProfileDetail : messageSenderDetail

    // console.log('is my profile  : -------', offerDetail?.userId == myProfileDetail?._id)
    let color = ''
    let messageText = ''
    let heading = '💃 congratulation'
    let headingColor = ''
    switch (props?.currentMessage?.message_type) {

        case MessageType.cancelDeal:
            color = Colors.bg_red_Opaque
            heading = 'Trade Canceled'
            headingColor = Colors.text_red_dark
            // Your deal has been canceled due to time out
            const cancelTimeOut = (props?.currentMessage?.text).includes('Your trade has been closed due to time out')

            if (userType == 'seller') {
                let canceltext = ''

                if (cancelTimeOut) {
                    canceltext = 'Trade has been closed due to time out please reinitiate trade. if you want to contitue this trade.'
                } else {
                    canceltext = 'has been canceled this deal.'
                }
                messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}><Text style={styles.higlighText}>{`${messageSenderDetail?.username ?? ''} `}</Text>{canceltext}</Text>
            } else {
                let canceltext = ''

                if (cancelTimeOut) {
                    canceltext = 'Trade has been canceled due to time out please wait until seller reinitiate this trade.'
                } else {
                    canceltext = 'You have canceled this trade.'
                }
                messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}>{canceltext}</Text>
            }
            break
        case MessageType.raiseADispute:
            color = Colors.bg_lemmon
            headingColor = Colors.text_Yellow
            const disputeBy = (props?.currentMessage?.text).includes('A Dispute is raised by Seller') ? 'Seller' : (props?.currentMessage?.text).includes('A Dispute is raised by Buyer') ? 'Buyer' : 'unvalid'
            const str = props?.currentMessage?.text ?? '{}'
            console.log(str, 'props?.currentMessage?.text props?.currentMessage?.text');

            const msgObj = JSON.parse(str)
            heading = `@ ${msgObj?.userType ?? 'Unknown'}`

            messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}>
                <Text style={styles.higlighText}>{` ${msgObj?.disputedBy ?? 'Unknown'}`}</Text> <Text style={styles.subtitleText}>{`raised a dispute.`}</Text>{'\n'}

                <Text style={styles.subtitleText}>{`\nDispute Related to`}</Text> : {`${msgObj?.disputedBy ?? 'No title found'}\n`}
                <Text style={styles.subtitleText}>{`\nDispute reason`}</Text> : {`${msgObj?.dscription ?? 'No title found'}\n\n`}
                Good day! This trade is now in dispute and we will do our best to provide you with a prompt resolution.{'\n'}

                Please do not cancel this and wait for our moderators to intervene in the trade chat, this way crypto is being held safely in escrow while this dispute is still active.{'\n'}

                To resolve this as quickly as possible, provide as much evidence as possible within the timeframe you were given upon the filing of your dispute.{'\n'}

                Upload a Screenshots of your online payment transaction history or upload a PDF copy of your online account statement for the last 10 days including the trade date.{'\n\n'}

                <Text style={styles.subtitleText}>{`What should you provide?\n`}</Text>

                Upload an audio recording of the conversation between you and your online payment provider’s support or a video recording of your chat with live support confirming the status of the payment.{'\n'}

                <Text style={styles.subtitleText}>{`Plese Note`}</Text>: we must hear/see details such as account name, account no, date of transfer, amount, and status of the transaction in the recording.{'\n'}

                Please take into consideration that due to the volume of trades, disputes may take up to 48 hours wait time to resolve.{'\n'}


            </Text>
            // } else {
            //     messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}>{disPuteText}</Text>
            // }
            break
        case MessageType.transactionPaid:
            color = Colors.opaqueBlue
            heading = 'Buyer Amount Paid'
            headingColor = Colors.text_lightBlack

            if (userType == 'seller') {
                messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}><Text style={styles.higlighText}>{`${messageSenderDetail?.username ?? ''}`} </Text>has been sucessfuly paid for this trade. Please release <Text style={styles.higlighText}>{(offerDetail?.symbol ?? '').toUpperCase()}</Text></Text>

            } else {
                messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}>You have been sucessfully paid for this trade. Please wait <Text style={styles.higlighText}>{`${messageSenderDetail?.username ?? ''}`}</Text> verify for payment recived or not.</Text>

            }
            break
        case MessageType.transactionReceived:
            color = Colors.bg_green_opaque
            headingColor = Colors.text_green

            // heading = '✅'
            if (userType == 'seller') {
                heading = 'Amount sent by seller'

                messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}>Congratulations!!.. you've been sucessfuly sent
                    <Text style={styles.higlighText}> {`${(tradeDetails?.sellingQuantity ?? '')} ${(offerDetail?.symbol ?? '').toUpperCase()}`} to <Text style={styles.higlighText}>{`${messageSenderDetail?.username ?? ''}`}</Text>
                    </Text></Text>
            } else {
                heading = 'Amount sent by seller'

                messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}> Congratulations!!.. <Text style={styles.higlighText}>{`${messageSenderDetail?.username ?? ''}`}</Text> have been sent <Text style={styles.higlighText}>{`${(tradeDetails?.sellingQuantity ?? '')} ${(offerDetail?.symbol ?? '').toUpperCase()}`}</Text> to your wallet. Please check your wallet</Text>
            }
            break
        case MessageType.initiateDeal:
            color = Colors.opaqueBlue
            headingColor = Colors.text_green

            // heading = '✅'
            if (userType == 'seller') {
                heading = 'Trade Restarted'
                messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}> Yor have restarted the trade. Please note that, you only have single chance for restrating the trade.  </Text>

            } else {
                heading = 'Trade Restarted'
                messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}> <Text style={styles.higlighText}>{`${messageSenderDetail?.username ?? ''}`}</Text> has been restarted this trade, you have last chance to buy this trade.  </Text>
            }
            break
            case MessageType.modrator:
                color = Colors.opaqueBlue
                headingColor = Colors.text_Yellow
    
                // heading = '✅'
                if (userType == 'seller') {
                    heading = `@${myProfileDetail?.username ?? ''}`
                    messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}>Moderator will contact you via email for further evidence or proofs. Please be active with your BharatBit registered email id. </Text>
    
                } else {
                    heading = `@${myProfileDetail?.username ?? ''}`

                    messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}>Moderator will contact you via email for further evidence or proofs. Please be active with your BharatBit registered email id. </Text>
                }
                break
        default:
            color = Colors.bg_green_opaque
            headingColor = Colors.text_Black


        // if (userType == 'seller') {
        //     messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}><Text style={styles.higlighText}>{`${anotherUserDetail?.firstName ?? ''} ${anotherUserDetail?.lastName ?? ''}`}</Text>has been sucessfuly paid for this deal. Please release<Text style={styles.higlighText}>{(offerDetail?.symbol ?? '').toUpperCase()}</Text></Text>

        //     // messageText = `default message ${(offerDetail?.symbol ?? '').toUpperCase()} to ${anotherUserDetail.firstName ?? ''} ${anotherUserDetail.lastName ?? ''} .`
        // } else {
        //     messageText = <Text style={{ ...TextStyles.regularMedium, color: Colors.text_Black }}><Text style={styles.higlighText}>{`${anotherUserDetail?.firstName ?? ''} ${anotherUserDetail?.lastName ?? ''}`}</Text>has been sucessfuly paid for this deal. Please release<Text style={styles.higlighText}>{(offerDetail?.symbol ?? '').toUpperCase()}</Text></Text>

        //     // messageText = `default message  ${user?.firstName ?? ''} ${user?.lastName ?? ''} have been sent ${(offerDetail?.symbol ?? '').toUpperCase()} to your wallet. Please check wallet ].`
        // }
    }

    return (

        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <View style={{ borderWidth: 1.2, borderRadius: 10, backgroundColor: color, borderColor: 'black', paddingHorizontal: moderateScaleVertical(20), paddingVertical: moderateScaleVertical(10) }}>
                <View style={{ marginBottom: 10 }}>

                    <Text style={{ ...TextStyles.bold, fontSize: 15, color: headingColor }}>{heading}</Text>

                </View>

                {/* <SystemMessage
                {...props}
                containerStyle={{}}
                wrapperStyle={{ borderWidth: 1.2, borderRadius: 10, backgroundColor: color, borderColor: 'black', paddingHorizontal: moderateScaleVertical(20), paddingVertical: moderateScaleVertical(10) }}
                textStyle={{ color: Colors.text_Black, fontWeight: '900' }}
            > */}

                {/* </SystemMessage> */}
                <View>
                    <Text style={{ ...styles.systemMessageText, marginBottom: moderateScaleVertical(12) }}>{messageText}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
                        <Image
                            style={{ height: scale(15), width: scale(15), }}
                            source={ImagePath.logo} />
                        <Text style={{ color: 'gray', fontSize: 12, alignSelf: 'flex-end', marginRight: moderateScale(5) }}>
                            {moment(props.currentMessage.createdAt).format('hh:mm A')}
                        </Text>
                    </View>
                </View>
            </View>

        </View>
    )

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
    }, subtitleText: {
        fontFamily: AppFonts.bold,
        color: Colors.text_Black,
        fontSize: 13
    },
    absoluteOffer: {
        position: 'relative', top: -height / 3.5
    }
});

// export default RenderBubble

export default React.memo(RenderSystemMessage);