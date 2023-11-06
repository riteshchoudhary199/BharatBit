//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image } from 'react-native';
import * as Components from "./indexx"
import { itemWidth, moderateScale, scale, textScale, width } from '../Styles/responsiveSize';
import { TextStyles } from '../Styles/ComnStyle';
import Colors from '../Colors/Colors';
import { IMAGE_URl } from '../Constants/Urls';
import { AppFonts, Constants, En, ImagePath } from '../Constants';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { currencySymbol, formatNumberToFixed } from '../Utils/helperFunctions';

// create a component
const TransactionComponent = ({ data, containerStyle, navigation, }) => {
    const trasDetail = data
    let offrCreateDate = moment(trasDetail?.createdAt).format('Do, MMM YYYY')

    const offerStatusText = () => {
        let status = trasDetail?.transaction_status
        return (
            <Text style={{
                ...TextStyles.medium, fontSize: textScale(15), color: status == 'pending' ?
                    Colors.text_Yellow : status == 'completed' ? Colors.text_green : Colors.text_red_dark
            }}>
                {`${(status || 'Nil').charAt(0).toUpperCase() + (status || 'Nil').slice(1)}`}
            </Text>
        )
    }

    const onPressBuy = () => {

        let payLoadParams = {
            transaction_id:{transaction_id:trasDetail?._id},
            transactionDetail:data
        }
        navigation.navigate(Constants.TransactionDetail, payLoadParams)
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        {/* Left component  */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) }}>
                            <Components.LoaderImage
                                imageUrl={((trasDetail?.transaction_logo) ? trasDetail?.transaction_logo : Image.resolveAssetSource(ImagePath.demoPerson).uri)}
                                indicatorSize='small'
                                style={styles.userImage}
                            />

                            <View style={{ gap: moderateScale(0) }}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={{ ...TextStyles.bold, fontSize: 18, maxWidth: width / 2.4, color: 'black', }} >
                                    {`${(trasDetail?.type || '').charAt(0).toUpperCase() + (trasDetail?.type || '').slice(1)} ${(trasDetail?.coin || '').toUpperCase()}`}
                                </Text>
                                {offerStatusText()}
                            </View>
                        </View>
                        {/* Right component  */}
                        <View style={{ alignItems: 'flex-end',flexShrink:1  }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(2),flexShrink:1 }}>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.bold, fontSize: textScale(15),flexShrink:1  }}>
                                    {/* {"15 BTC"} */}
                                    {` ${formatNumberToFixed(trasDetail?.quantity ?? 0) || ''} ${(trasDetail?.coin || '').toUpperCase()}`}
                                </Text>
                                <Components.LoaderImage
                                    imageUrl={((trasDetail?.coin_logo) ? trasDetail?.coin_logo : Image.resolveAssetSource(ImagePath.demoPerson).uri)}
                                    indicatorSize='small'
                                    style={styles.coinIcon}
                                />
                            </View>
                            {/* Price  */}
                            <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.small, ...styles.userDisc, textAlign: 'right', width: itemWidth / 2.5 }}>
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
        height: scale(50), width: scale(50), borderRadius: 100
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
export default TransactionComponent;
