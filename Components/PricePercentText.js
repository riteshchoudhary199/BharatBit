//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { TextStyles } from '../Styles/ComnStyle';
import { Colors, En } from '../Constants';
import { moderateScaleVertical } from '../Styles/responsiveSize';
import { formatNumberToFixed, getCountryCurrencyCountryCode } from '../Utils/helperFunctions';

// USEAGE : ---
{/* <Components.PricePercentText
coinQty={offerDetail?.quantity}
selling_price={offerDetail?.selling_price}
coinName={offerDetail?.coin}
/> */}


// create a component
const PricePercentText = ({ coinQty, selling_price, coinName, textStyle ,percentage,currencyName,currencySymbl}) => {
    // const homeRedux = useSelector((state) => state?.homeReducer)
    // const allCoinsList = homeRedux?.allCoinsList
    // const coin = allCoinsList.find(item => item?.name === coinName ?? '')
    // // MARK : ---- Total Coins Price accor to market price 
    // const totalConsPriceLivePric = coin?.inrLivePrice ?? 0 * coinQty ?? 0
    // // MARK : ---- Differ between selleing price and Market price
    // const differ = selling_price ?? 0 - totalConsPriceLivePric ?? 0
    // // MARK : ---- Get difference percentage 
    // const finalPricePer = 0.00// parseFloat(differ / 100).toFixed(2)


    const walletReducer = useSelector((state) => state?.wallet)
    const coinDetails = walletReducer?.coinsDetails
    // const curretCoin = coinName=== 'USDT'?'tether':coinName.toLowerCase()
    // const selectLiveCoin = coinDetails ? coinDetails[coinName ?? ''] : ''

    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    // const MPrc = Number() * Number(coinQty)
    // const finalPricePer = (( MPrc - Number(selling_price)) / 100)
// const [finalPricePer,setFinalPricePer] = useState(0)
// const [currencySymbol, setCurrencySymbol] = useState('')

// const coin = coinName
        const curretCoin = coinName === 'USDT' ? 'tether' : coinName?.toLowerCase()
        const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
     
        const MRP = Object.hasOwn(selectLiveCoin, currencySymbl) ? selectLiveCoin[currencySymbl?.toLowerCase()] : selectLiveCoin['usd']
        const MPrc = Number(MRP) * Number(coinQty)
        const finalPricePer = (( (Number(selling_price) - Number( Number(MRP) * Number(coinQty))) / Number(selling_price)) * 100)


        console.log('MRP curretCoin :----',curretCoin);
        console.log('MRP ( Number(selling_price) - MPrc) :----',( Number(selling_price) - MPrc));

        console.log('MRP selectLiveCoin :----',selectLiveCoin);
        console.log('MRP MRP :----',MRP);
        console.log('MRP MPrc :----',MPrc);
        console.log('MRP finalPricePer :----',finalPricePer);

        console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-');
// useEffect(()=>{
//     getMarketPrice()
// })

    // const getMarketPrice = () => {
        // const coin = coinName
        // const curretCoin = coin === 'USDT' ? 'tether' : coin.toLowerCase()
        // console.log('GetOfferComponent curretCoin curretCoin :---', curretCoin);
        // const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
        // const crrncySymbl = await getCountryCurrencyCountryCode(myProfileDetail?.country !== undefined ? myProfileDetail?.country : Localize.countryCode)
        // const MRP = Object.hasOwn(selectLiveCoin, crrncySymbl) ? selectLiveCoin[crrncySymbl.toLowerCase()] : selectLiveCoin['usd']
        // const MRP = selectLiveCoin[myCurrency]
        // const MPrc = Number(MRP) * Number(coinQty)
        // const finalPricePer = (( MPrc - Number(selling_price)) / 100)
        // setFinalPricePer(finalPricePer)


        // const curretCoin = coinName === 'USDT' ? 'tether' : coinName?.toLowerCase()
        // if (coinDetails == undefined){return}
        // const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
        // const MRP = Object.hasOwn(selectLiveCoin, (currencyName?currencyName:'usd' ).toLowerCase()) ? selectLiveCoin[(currencyName?currencyName:'usd' ).toLowerCase()] : selectLiveCoin['usd']
        // const MPrc = Number(MRP) * Number(coinQty)
        // const finalPricePer = (( MPrc - Number(selling_price)) / 100)
        // const symb = Object.hasOwn(selectLiveCoin, (currencyName?currencyName:'usd' ).toLowerCase()) ? currencySymbl : '$'
        // setFinalPricePer(finalPricePer)
        // setCurrencySymbol(symb)

    // }


    const isBelow = Number(percentage) < 0//finalPricePer < 0
    const isEqual = Number(percentage) === 0//finalPricePer === 0
    const isGreater = Number(percentage) > 0 //finalPricePer > 0
    return (
        // <View style={styles.container}>
        <Text style={{
            ...TextStyles.small, ...styles.orderDiscript, ...textStyle,
            color: isBelow ? Colors.text_red_dark : isEqual ? Colors.text_DarkGray : Colors.text_green
        }}>
            {`${`${!isEqual ? (finalPricePer ? formatNumberToFixed(percentage,2) : '0') : ''}${!isEqual ? "%" : ''}`} ${isBelow ? En.below_Market_Price : isEqual ? En.same_As_Market_Price : En.above_Market_Price}`}
        </Text>

        // </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    }, orderDiscript: {
        color: Colors.text_green,
        marginRight: 0,
        textAlign: 'right',
        marginTop: moderateScaleVertical(4)
    },
});

//make this component available to the app
export default React.memo(PricePercentText);

 