//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image } from 'react-native';
import * as Components from "./indexx"
import { itemWidth, moderateScale, scale, textScale, width } from '../Styles/responsiveSize';
import { TextStyles } from '../Styles/ComnStyle';
import Colors from '../Colors/Colors';
import { IMAGE_URl } from '../Constants/Urls';
import { Constants, En, ImagePath } from '../Constants';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { currencySymbol, formatNumberToFixed, getCountryCurrencyCountryCode } from '../Utils/helperFunctions';



// create a component
const MyOfferList = ({ data, containerStyle, navigation, }) => {

    console.log('data load MyOfferList is : --  ', data)


    let offrCreateDate = moment(data?.createdAt).format('Do, MMM YYYY')
    const offerDetail = data
    const walletReducer = useSelector((state) => state?.wallet)
    const coinDetails = walletReducer?.coinsDetails
    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)

    // const curretCoin = coin=== 'USDT'?'tether':coin.toLowerCase()
    // const selectLiveCoin = coinDetails ? coinDetails[curretCoin ?? ''] : ''
    // const crrncySymbl = getCountryCurrencyCountryCode(myProfileDetail?.country)
    // const myCurrency = selectLiveCoin.find((item) == crrncySymbl.toLowerCase())

    // const marketPrice = selectLiveCoin[myCurrency ?? 'usd']
    // const [marketPrice, setMarketPrice] = useState(0)
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    // const [currencySymbol, setCurrencySymbol] = useState('')


    const coin = offerDetail?.coin
    const curretCoin = coin === 'USDT' ? 'tether' : coin?.toLowerCase()
    const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
    // const crrncySymbl = await getCountryCurrencyCountryCode(myProfileDetail?.country !== undefined ? myProfileDetail?.country : Localize.countryCode)
    const marketPrice = Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? selectLiveCoin[offerDetail?.currency_name?.toLowerCase()] : selectLiveCoin['usd']
    // console.log('GetOfferComponent marketPrice marketPrice :---', MRP);
    const currencySymbol =  Object.hasOwn(selectLiveCoin, offerDetail?.currency_name?.toLowerCase()) ? offerDetail?.currency_symbol : '$'
    // setMarketPrice(MRP)
    // setCurrencySymbol(symb)


    useEffect(() => {
        calculatePrice()
    }, [coinDetails])
useEffect(()=>{
    getMarketPrice()
})
    const getMarketPrice = async () => {
        // const [marketPrice, setMarketPrice] = useState(0)
    
           

        }

    const calculatePrice = () => {
        if (offerDetail?.sell_at_mp) {
            // const minInitPrice = parseFloat(marketPrice ?? 0) * parseFloat(offerDetail?.minQuantity ?? 0)
            // const minPercentPrice = parseFloat(minInitPrice) ?? 0 / 100 * parseFloat(offerDetail?.percentage ?? 0)
            // const maxInitPrice = parseFloat(marketPrice ?? 0) * parseFloat(offerDetail?.maxQuantity ?? 0)
            // const maxPercentPrice = parseFloat(maxInitPrice) ?? 0 / 100 * parseFloat(offerDetail?.percentage ?? 0)

            console.log("\n\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
            const minPrice = ((((marketPrice * offerDetail?.minQuantity) / 100) * offerDetail.percentage) + (marketPrice * offerDetail?.minQuantity))
            const maxPrice = ((((marketPrice * offerDetail?.lockedQuantity) / 100) * offerDetail.percentage) + (marketPrice * offerDetail?.lockedQuantity))
            setMinPrice(minPrice)
            setMaxPrice(maxPrice)

        } else {
            const minPrice = offerDetail?.maxAmount
            const maxPrice = offerDetail?.minAmount
            setMinPrice(minPrice)
            setMaxPrice(maxPrice)
        }
    }

    const onCellSelection = () => {
        // _onMoveToNextScreen(navigation,Constants.chat,userDetail)
        let payLoadParams = {
            offerId: data?._id,
        }
        navigation.navigate(Constants.OfferDetail, payLoadParams)
        // onPressBuyBtn
    }
    return (
        <View style={styles.container}>
            <TouchableHighlight
                underlayColor={Colors.selectedBg}
                style={styles.touchAble}
                onPress={onCellSelection}
            >

                <View style={{ paddingVertical: moderateScale(8), gap: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Left component  */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(0),flexShrink:1 }}>
                            <View style={{ gap: moderateScale(4),flexShrink:1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(3),flexShrink:1 }}>
                                    <Text style={{ ...TextStyles.bold, fontSize: textScale(15),}}>
                                        {`${formatNumberToFixed(data?.maxQuantity)} ${(data?.symbol || '').toUpperCase()}`}
                                    </Text>
                                    <Components.LoaderImage
                                        imageUrl={((data?.coin_logo) ? data?.coin_logo : Image.resolveAssetSource(ImagePath.demoPerson).uri)}
                                        indicatorSize='small'
                                        style={styles.coinIcon}
                                    />
                                </View>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.small, ...styles.userDisc, width: itemWidth / 2.2 }}>
                                    {`${En.Order_placed_on} ${offrCreateDate}`}
                                </Text>

                            </View>

                        </View>

                        {/* Right component  */}

                        <View style={{ alignItems: 'flex-end',flexShrink:1  }}>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={{ ...TextStyles.bold, fontSize: textScale(15), }}>
                                {`${currencySymbol} ${maxPrice ? formatNumberToFixed(maxPrice,2):''}`}
                            </Text>
                            {/* Price  */}
                            {/* <Components.PricePercentText
                                coinQty={data?.maxQuantity}
                                selling_price={maxPrice}
                                coinName={data?.coin}
                                percentage={data?.percentage}
                                currencyName={data?.currency_name}
                                currencySymbl={data?.currency_symbol}
                            /> */}

                        </View>

                    </View>
                    {data?.sell_partially &&
                        <Text style={{ ...TextStyles.bold, fontSize: textScale(15) }}>
                            {`${'Min Price:'} ${currencySymbol} ${(minPrice ? formatNumberToFixed(minPrice,2) : '0')}`}
                        </Text>
                    }

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
        flex: 1, height: '100%', paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(12),
        overflow: 'hidden'
    },
    coinIcon: {
        height: scale(22), width: scale(22), borderRadius: 100
    },

    userDisc: {
        color: Colors.text_DarkGray,
        marginRight: 0,
        textAlign: 'left',
        fontSize: textScale(12)
    },
});

//make this component available to the app
export default MyOfferList;
