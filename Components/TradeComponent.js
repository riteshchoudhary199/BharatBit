//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image } from 'react-native';
import * as Components from "./indexx"
import { itemWidth, moderateScale, scale, textScale, width } from '../Styles/responsiveSize';
import { TextStyles } from '../Styles/ComnStyle';
import Colors from '../Colors/Colors';
import { IMAGE_URl } from '../Constants/Urls';
import { Constants, En, ImageEnum, ImagePath } from '../Constants';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {formatNumberToFixed, showAlertMessage } from '../Utils/helperFunctions';

// create a component
const TradeComponent = ({ data, containerStyle, navigation,currency_symbol,currency_name,coin }) => {
console.log('data from TradeComponent : ---- ', data);
    const myDeatils = useSelector((state) => state.auth?.userDetail)
    // console.log('data load in user list ', data)
const dealsData = data?.dealsData
    // const lastChat = data?.last_chat
    // const userDetail = data?.user_1?._id == myDeatils?._id ? data?.user_2 : data?.user_1
    const userName = dealsData?.user1 == myDeatils?._id ? data?.user2?.username : data?.user1?.username
    // let offer_details = data?.offer_details
    let offrCreateDate = moment(dealsData?.timerStart).format('Do, MMM YYYY')

    const offerStatusText = () => {
        const isCanceled = dealsData?.isCanceled
        let status = dealsData?.chatStatus
        // let statusTitle = status == `${(status).charAt(0).toUpperCase() + (status || '').slice(1)}`

        return (
            <Text numberOfLines={2} ellipsizeMode='tail' style={{
                ...TextStyles.bold,fontSize:16 ,color: status == 'pending' ?
                    Colors.text_Yellow : status == 'successful' ? Colors.text_green : status =='canceled'? Colors.text_red_dark:Colors.text_Black
            }}>
                {status && (status).charAt(0).toUpperCase() + (status || '').slice(1)}
                {/* {`${(status || '').charAt(0).toUpperCase() + (status || '').slice(1)}`} */}
            </Text>
        )
    }

    const onPressBuy = () => {
        // _onMoveToNextScreen(navigation,Constants.chat,userDetail)
        // let payloadParams = {
        //     "offer_id": offer_details?._id,
        //     "receiver_id": userDetail?._id
        // }
        // let payLoadParams = {
        //     chatExchangeId:data?._id,
        //     offer_id: offer_details?._id,
        //     receiver_id: userDetail?._id
        // }
   
        // navigation.navigate(Constants.chat, payLoadParams)
        // onPressBuyBtn
    }
    return (
        <View style={styles.container}>
            <TouchableHighlight
                underlayColor={Colors.selectedBg}
                style={styles.touchAble}
                onPress={onPressBuy}
            >
                <View style={{ paddingVertical: moderateScale(0) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Left component  */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) }}>
                            {/* <Components.LoaderImage
                                imageUrl={IMAGE_URl + ((userDetail?.profilePic) ? userDetail?.profilePic : Image.resolveAssetSource(ImagePath.demoPerson).uri)}
                                indicatorSize='small'
                                style={styles.userImage}
                            /> */}

                            <View style={{ gap: moderateScale(0),flexShrink:1 }}>
                                <Components.GradientText
                                    colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                                    style={{ ...TextStyles.large, ...styles.userName }} >
                                    {/* {"userName"} */}
                                    {`${userName ?? ''}`}
                                </Components.GradientText>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.small, ...styles.userDisc, width: itemWidth / 2.5 }}>
                                    {`${En.Order_placed_on} ${offrCreateDate}`}
                                </Text>
                                {/* <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.medium, }}>
                                    {"Status"} 
                                    {`${offer_status}`}
                                </Text> */}
                                {offerStatusText()}
                            </View>
                        </View>
                        {/* Right component  */}
                        <View style={{ alignItems: 'flex-end',flexShrink:1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(2),flexShrink:1 }}>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.bold, fontSize: textScale(15) ,}}>
                                    {/* {"15 BTC"} */}
                                    {`  ${(dealsData?.sellingQuantity ? formatNumberToFixed(dealsData?.sellingQuantity):'' )} ${coin}`}
                                </Text>
                                {/* <Components.LoaderImage
                                    imageUrl={((offer_details?.coin_logo) ? offer_details?.coin_logo : Image.resolveAssetSource(ImagePath.demoPerson).uri)}
                                    indicatorSize='small'
                                    style={{...styles.coinIcon,width:offer_details?.symbol =='eth'?scale(12):scale(22)}}
                                /> */}
                            </View>
                            {/* Price  */}
                            <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.medium, textAlign: 'right', color: Colors.text_green, fontSize: textScale(14) }}>
                                {`${currency_symbol} ${formatNumberToFixed(dealsData?.sellingAmount,2)|| ''}`}
                            </Text>
                            {/* {(data?.unread_count !== 0) &&
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(5) }}>
                                    <Components.GradientText numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.medium,fontSize:textScale(15) ,textAlign: 'right' }}>
                                        {`${En.unread}`}
                                    </Components.GradientText>
                                    <View style={{ backgroundColor: Colors.gradiantDwn, borderRadius: 100, height: moderateScale(25), width: moderateScale(25), justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ ...TextStyles.medium, fontSize: textScale(15), color: Colors.text_White, marginHorizontal: 1 }} numberOfLines={1} ellipsizeMode='tail'>
                                            {`${data?.unread_count ?? ''}`}
                                        </Text>
                                    </View>
                                </View>
                            } */}
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 0,
        backgroundColor: Colors.app_White
    },
    touchAble: {
        flex: 1, height: '100%', paddingHorizontal: 12,
        paddingVertical: moderateScale(6),
        overflow: 'hidden'
    },
    userImage: {
        height: scale(50), width: scale(50), borderRadius: 100
    },
    coinIcon: {
        height: scale(22),width: scale(22), borderRadius: 100,
    },
    userName: {
        fontSize: textScale(15),
    },
    userDisc: {
        color: Colors.text_DarkGray,
        marginRight: 0,
        textAlign: 'left',
        fontSize: textScale(12)
    },
});

//make this component available to the app
export default TradeComponent;