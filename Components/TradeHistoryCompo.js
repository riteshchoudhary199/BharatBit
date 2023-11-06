//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image } from 'react-native';
import * as Components from "./indexx"
import { itemWidth, moderateScale, scale, textScale, width } from '../Styles/responsiveSize';
import { TextStyles } from '../Styles/ComnStyle';
import Colors from '../Colors/Colors';
import { IMAGE_URl } from '../Constants/Urls';
import { AppFonts, Constants, En, ImageEnum, ImagePath } from '../Constants';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { currencySymbol, formatNumberToFixed } from '../Utils/helperFunctions';

// create a component
const TradeHistoryCompo = ({ data, containerStyle, navigation, }) => {
    const trasDetail = data
    let offrCreateDate = moment(trasDetail?.createdAt).format('Do, MMM YYYY')
// console.log('TradeHistoryCompo : --',data)
    const offerStatusText = () => {
        let status = trasDetail?.offer_status
        // "created","pending","successful","deleted"
        const statusText = status == 'successful' ? 'completed': status == 'created'?'Open':status == 'pending'?'Open':status
        return (
            <Text style={{
                ...TextStyles.medium, fontSize: textScale(15), color: statusText == 'Open' ?
                    Colors.text_Yellow : statusText == 'completed' ? Colors.text_green : Colors.text_red_dark
            }}>
                {`${(statusText || '').charAt(0).toUpperCase() + (statusText || 'Nil').slice(1)}`}
            </Text>
        )   
    }

    const onPressBuy = () => {

        // let payLoadParams = {
        //     transaction_id:{transaction_id:trasDetail?._id},
        //     transactionDetail:data
        // }

        let payLoadParams = {
            offerId: trasDetail?._id,
        }
        navigation.navigate(Constants.OfferDetail, payLoadParams)
        // onPressBuyBtn
    }
    return (
        <View style={styles.container}>
            <TouchableHighlight
                underlayColor={navigation ? Colors.selectedBg : Colors.transparent}
                style={styles.touchAble}
                onPress={(navigation) && onPressBuy}
            >
                <View style={{ paddingVertical: moderateScale(5), }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        {/* Left component  */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(15) ,}}>
                            <Components.LoaderImage
                                imageUrl={((trasDetail?.coin_logo) ? trasDetail?.coin_logo : Image.resolveAssetSource(ImagePath.demoPerson).uri)}
                                indicatorSize='small'
                                style={styles.userImage}
                                resizeMode={ImageEnum.cover}
                            />

                            <View style={{flexShrink:1}}>
                                <Text  style={{ ...TextStyles.bold, fontSize: 18, color: 'black'}} >
                                    {`${ trasDetail?.maxQuantity ? formatNumberToFixed(trasDetail?.maxQuantity):''}`} {`${(trasDetail?.symbol || '').toUpperCase()}`}
                                </Text>
                                {offerStatusText()}
                               
                            </View>
                        </View>
                        {/* Right component  */}
                        <View style={{}} >
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                           
                                <Text  style={{ ...TextStyles.bold, fontSize: textScale(15),color:Colors.text_Green_dark,flex:1}} numberOfLines={1} >
                                <Text style={{ ...TextStyles.bold, fontSize: textScale(15) }}>
                                    {/* {"15 BTC"} */}
                                    {`at`}
                                </Text>
                                    {/* {"15 BTC"} */}
                                    {` ${currencySymbol("INR")} ${ trasDetail?.maxAmount ?formatNumberToFixed(trasDetail?.maxAmount):''}`}
                                </Text>
                                {/* <Components.LoaderImage
                                    imageUrl={((trasDetail?.coin_logo) ? trasDetail?.coin_logo : Image.resolveAssetSource(ImagePath.demoPerson).uri)}
                                    indicatorSize='small'
                                    style={styles.coinIcon}
                                /> */}
                            </View>
                            {/* Price  */}
                            <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.small, ...styles.userDisc, textAlign: 'right', }}>
                                {`${offrCreateDate}`}
                            </Text>

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
        // flex: 1,
        marginHorizontal: 0,
        backgroundColor: Colors.app_White, 
    },
    touchAble: {
        // flex: 1,
        //  height: '100%', 
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(6),
        overflow: 'hidden'
    },
    userImage: {
        height: scale(45), width: scale(45), borderRadius: 100
    },
    coinIcon: {
        height: scale(20), width: scale(20), borderRadius: 100
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
export default TradeHistoryCompo;
