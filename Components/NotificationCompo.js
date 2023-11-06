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
const NotificationCompo = ({ data, containerStyle, navigation, }) => {

    let offrCreateDate = moment(data?.createdAt).format('Do, MMM YYYY')


    const onPressBuy = () => {

        // let payLoadParams = {
        //     transaction_id:{transaction_id:trasDetail?._id},
        //     transactionDetail:data
        // }

        // let payLoadParams = {
        //     offerId: trasDetail?._id,
        // }
        // navigation.navigate(Constants.OfferDetail, payLoadParams)
        // onPressBuyBtn
    }

    const userImage = data?.image?.includes('http') ? data?.image : `${IMAGE_URl}${data?.image}`
    return (
        <View style={styles.container}>
            <TouchableHighlight
                underlayColor={navigation ? Colors.selectedBg : Colors.transparent}
                style={styles.touchAble}
                onPress={(navigation) && onPressBuy}
            >
                <View style={{ paddingVertical: moderateScale(5), }}>
                    <View style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Left component  */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(15) }}>
                            <Components.LoaderImage
                                imageUrl={userImage}
                                indicatorSize='small'
                                style={styles.userImage}
                                resizeMode={ImageEnum.cover}
                            />

                            <View style={{ flex: 1 }}>
                                <Text style={{ ...TextStyles.bold, fontSize: 18, color: 'black' }} >
                                    {`${data?.body ?? ''}`}
                                </Text>
                                <Text style={{ ...TextStyles.small, ...styles.userDisc, textAlign: 'right', }}>
                                    {`${offrCreateDate}`}
                                </Text>
                            </View>
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
export default NotificationCompo;
