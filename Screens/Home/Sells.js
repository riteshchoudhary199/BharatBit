//import liraries
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, TextInput, StatusBar, Pressable } from 'react-native';
import { CommonStyles, TextStyles } from '../../Styles/ComnStyle';
import Colors from '../../Colors/Colors';
import ImagePath from '../../Constants/ImagePath';
import { moderateScale, moderateScaleVertical, scale, textScale, width } from '../../Styles/responsiveSize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Alerts, Localize, Titles, En, AppFonts, ImageEnum, Constants } from '../../Constants';
import * as Components from "../../Components/indexx"
import Actions from '../../Redux/Actions';
import { showAlertMessage, success, danger, getPriceInPercent, warning, formatNumberToFixed, delayed } from '../../Utils/helperFunctions';
import { useSelector } from 'react-redux';
import CountryPicker from "react-native-country-picker-modal";
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../../Services/NavigationService';

// create a component


export const TextInputVw = ({ onBlur = () => { }, onFocus = () => { }, value, rightText, leftTextStyle, bottomTextStyle, rightTextStyle, textStyle, onChangeText = () => { }, editable, placeholder = En.Enter_Manually, headerText, bottomText, containerStyle, defaultValue, keyboardType = 'decimal-pad' }) => {
    return (
        <View style={{ ...styles.textInput, ...containerStyle }}>
            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader, }}>{headerText}</Text>
            <Components.CustomTextInput
                // props={props}
                // onBlur={onBlur}

                rightText={rightText}
                rightTextStyle={rightTextStyle}
                leftTextStyle={leftTextStyle}
                textStyle={textStyle}
                innerContainerStyle={styles.textInputInnerContainer}
                value={value}
                editable={editable}
                defaultValue={defaultValue}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                isshowLeftImg={false}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
            />
            {
                bottomText &&
                <Text style={{ ...TextStyles.medium, ...styles.orderDiscript, ...bottomTextStyle }}>{bottomText}</Text>
            }

        </View>
    )

}

export const MulipeSelectionView = ({ hederTitle, optionsArr, selectedVal, onselect = () => { } }) => {

    return (
        <View style={styles.sellAtContainer}>
            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{hederTitle}</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: moderateScaleVertical(16) }}>
                {optionsArr.map((item, index) => {
                    const isSelected = selectedVal?.id == item?.id
                    return (
                        <TouchableHighlight //>
                            underlayColor={Colors.transparent}
                            onPress={() =>
                                onselect(item)
                                // setSelectedSellAt(item)
                            }
                        >
                            <View style={styles.paymentMethod}>
                                <Image source={isSelected ? ImagePath.swith_on : ImagePath.swith_off_single} style={{ ...styles.itemSwichIcon }} />

                                {/* {getSelectedImage(item?.paymentMethodType)} */}
                                <Text style={{ ...TextStyles.medium, ...styles.itemPaymTypeTitle, color: isSelected ? Colors.darkGrayTxt : Colors.lightGreyTxt }}
                                >{item?.value}</Text>
                            </View>
                        </TouchableHighlight>
                    )
                }
                )}
            </View>
        </View>
    )
}

export const TitleMessage = ({ coinQty, marketPrice, maxSellPrice, isSellPatially, selectedCoin, currencySymbol, getAdminMargin, }) => {
    const mPrice = formatNumberToFixed(formatNumberToFixed(coinQty) * formatNumberToFixed(marketPrice ?? 0, 2), 2)
    const finalCoinQty = formatNumberToFixed(formatNumberToFixed(coinQty) - formatNumberToFixed(getAdminMargin))

    const marginPrice = (formatNumberToFixed(maxSellPrice, 2) && (formatNumberToFixed(maxSellPrice, 2) > mPrice)) ? <Text style={{ ...TextStyles.small, }}> You have sell this deal <Text style={styles.higlighText}>{`( ${currencySymbol} ${formatNumberToFixed((formatNumberToFixed(maxSellPrice, 2) - mPrice), 2)} )`}</Text> above market price.</Text> :
        (maxSellPrice && (formatNumberToFixed(maxSellPrice, 2) < mPrice)) ? <Text style={{ ...TextStyles.small, }} > You have sell this deal <Text style={styles.higlighText}>{`( ${currencySymbol} ${formatNumberToFixed((formatNumberToFixed(maxSellPrice, 2) - mPrice), 2)} )`}</Text>  below market price.</Text> :
            <Text style={{ ...TextStyles.small, }} > You have sell this deal as market price.</Text>
    const mpText = (isSellPatially.value == Titles.Yes) ? `Your deal has been updated according to market price` : ''

    const adminShare = (getAdminMargin > 0) ? <Text style={{ ...TextStyles.small, }}> After adding platform  <Text style={styles.higlighText}>{`${getAdminMargin ? `${formatNumberToFixed(getAdminMargin)}` : 0} ${`${selectedCoin ? selectedCoin?.name?.toUpperCase() : ''}`} `}</Text> you are selling <Text style={styles.higlighText}>{`${finalCoinQty ? `${formatNumberToFixed(finalCoinQty)}` : 0} ${`${selectedCoin ? selectedCoin?.name?.toUpperCase() : ''}`} `}</Text></Text> : ''
    return (
        <>
            <Text style={{ ...TextStyles.small, textAlign: 'center' }}>
                You are creating the deal of<Text style={styles.higlighText}> {coinQty ? `${Number(coinQty)}` : 0} {`${selectedCoin ? selectedCoin?.name?.toUpperCase() : ''}`}</Text> at price of<Text style={styles.higlighText}> {`(${currencySymbol} ${formatNumberToFixed(maxSellPrice)})`}</Text>{marginPrice}{mpText}{adminShare}.
            </Text>
        </>

    )
}

export const PicePercentVw = ({pricePercentArr, onPressAmmontPercent,selectedPercentage}) => {
    return (
        <View style={styles.amountfromWalletContainer}>
            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{En.Amount_From_Wallet}</Text>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                {pricePercentArr.map((item, index) => <Components.CustomButton
                    containerStyle={{ ...styles.ammounPercentBox, ...{ borderColor: item.pricePercent == selectedPercentage ? Colors.app_Black : Colors.gradiantDwn } }}
                    title={item.pricePercent + '%'}
                    titleStyle={{ ...TextStyles.medium }}
                    bgColors={[Colors.gradiantOpaqeUp, Colors.gradiantOpaqeDown]}
                    isDigonal={true}
                    onPress={() => onPressAmmontPercent(item.pricePercent)}
                />)}

            </View>
        </View>
    )
}

export const PaymentMetodVw = ({paymentTypeArr,selectedPaymentMetodArr,updatePaymentMetodArr}) => {

    return (
        <View style={styles.amountfromWalletContainer}>

            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader, marginTop: moderateScale(10), }}>{En.Amount_From_Wallet}</Text>
            {
                (paymentTypeArr.length > 0) ? <>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: moderateScaleVertical(16) }}>


                        {paymentTypeArr.map((item, index) => {
                            const isSelected = selectedPaymentMetodArr?.filter(data => data._id == item?._id)
                            const typeImage = item?.image?.includes('http') ? item?.image : ImagePath + item?.image
                            return (
                                <TouchableHighlight //>
                                    underlayColor={Colors.transparent}
                                    onPress={() =>
                                        updatePaymentMetodArr(item)
                                    }
                                >
                                    <View style={styles.paymentMethod}>
                                        {isSelected?.length ?
                                            <Image source={ImagePath.chek} style={{ ...styles.itemSwichIcon }} /> :

                                            <Components.LoaderImage
                                                imageUrl={isSelected?.length ? Image.resolveAssetSource(ImagePath.chek).uri : typeImage}
                                                placeHolderUrl={Image.resolveAssetSource(ImagePath.payType).uri}
                                                style={styles.itemSwichIcon}
                                                indicatorSize={'small'}
                                                resizeMode={isSelected?.length ? ImageEnum.contain : ImageEnum.contain}
                                            />
                                        }
                                        {/* <Image source={isSelected?.length ? ImagePath.chek : ImagePath.unCheck} style={{ ...styles.itemSwichIcon }} /> */}


                                        {/* {getSelectedImage(item?.paymentMethodType)} */}
                                        <Text style={{ ...TextStyles.medium, ...styles.itemPaymTypeTitle, color: isSelected?.length ? Colors.darkGrayTxt : Colors.lightGreyTxt }}

                                        // <Text style={{ ...TextStyles.medium, ...styles.itemPaymTypeTitle, }}
                                        >{item?.name}</Text>
                                    </View>
                                </TouchableHighlight>
                            )
                        }
                        )}
                    </View>
                </> :
                    <>
                        <Components.EmptyList
                            contanerStyle={{ marginVertical: 0 }}
                            subTitle='No payment method available'
                        />
                    </>

            }



        </View>
    )
}
const Sells = ({ navigation, route }) => {

    // let paymentTypes = [{ id: 1, paymentMethodType: En.UPI },
    // { id: 2, paymentMethodType: En.Bank_transfer },
    // { id: 3, paymentMethodType: En.IMPS },
    // { id: 4, paymentMethodType: En.RTGS },
    // { id: 5, paymentMethodType: En.PayPal },
    // ]
    let sellTypeArr = [{ id: 1, value: En.Market_price },
    { id: 2, value: En.Fixed_Price },
    ]
    let sellPartiallyArr = [{ id: 1, value: Titles.Yes },
    { id: 2, value: Titles.No },
    ]
    let pricePercentArr = [
        { id: 1, pricePercent: 25 },
        { id: 2, pricePercent: 50 },
        { id: 3, pricePercent: 75 },
        { id: 4, pricePercent: 100 }
    ]
    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    const [selectedCoin, setSelectedCoin] = useState()//'
    const [selectedPaymentMetodArr, setselectedPaymentMetodArr] = useState([])
    const [coinAmount, setCoinAmount] = useState('')
    const [coinQty, setcoinQty] = useState('')
    const [title, setTitle] = useState('')
    const [marginPercentage, setMarginPercentage] = useState('0')
    const [minSellPrice, setMinSellPrice] = useState('')
    const [maxSellPrice, setMaxSellPrice] = useState('')
    const [minQtySell, setMinQtySell] = useState('')
    const [coinSellAt, setCoinSellAt] = useState('')
    const [error, setError] = useState({})


    const [discription, setDiscription] = useState()
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState(Localize.countryCode);
    const [isVisible, setIsVisible] = useState(false)
    const [walletCoinDetail, setWalletCoinDetail] = useState()
    const [selectedPercentage, setSelectedPercentage] = useState()
    const [selectedSellAt, setSelectedSellAt] = useState(sellTypeArr[0])
    const [isSellPatially, setIsSellPatially] = useState(sellPartiallyArr[0])
    const [coinsTypeArr, setcoinsTypeArr] = useState([])
    const [showModal, setShowModal] = useState(false)
    // const [paymentTypeArr, setPaymentTypeArr] = useState(paymentTypes)

    const myCoinDetails = useSelector((state) => state?.auth?.coinDetails)
    const walletReducer = useSelector((state) => state?.wallet)
    const adminDetails = useSelector((state) => state?.wallet?.adminDetails)
    const selectedCoinAdmin = adminDetails?.profits.find((item) => item?.coin_type == selectedCoin?.name)
    const adminMarginPercent = selectedCoinAdmin?.seller
    // console.log('selectedCoinAdmin are : ---',adminMarginPercent);

    const coinDetails = walletReducer?.coinsDetails
    const paymentTypeArr = walletReducer?.paymentMethods
    console.log('my coindetails :---', myCoinDetails);
    const curretCoin = selectedCoin?.name === 'USDT' ? 'tether' : selectedCoin?.name?.toLowerCase()
    const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''

    const marketPrice = Object.hasOwn(selectLiveCoin, myProfileDetail?.currency_name?.toLowerCase()) ? selectLiveCoin[myProfileDetail?.currency_name?.toLowerCase()] : selectLiveCoin['usd']
    const currencySymbol = Object.hasOwn(selectLiveCoin, myProfileDetail?.currency_name?.toLowerCase()) ? myProfileDetail?.currency_symbol : myProfileDetail?.currency_symbol//'$'
    const getAdminMargin = formatNumberToFixed(coinQty / Number(maxSellPrice) * (Number(adminMarginPercent) / 100 * Number(maxSellPrice)))
    const isFocused = useIsFocused();
    useEffect(() => {
        Actions.getNotificationsCount()
    }, [isFocused]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            clearData()
        });

        return unsubscribe;
    }, [navigation]);
 
   
    useEffect(() => {
        Actions.userProfileAction()
        // if (coinsTypeArr?.length <= 1) {
        getAllCoins()
        // }
        getPaymentMethods()
        console.log('curren country code ', Localize.countryCode)
    }, []);

    const updateCoinSelection = (item) => {


        setSelectedCoin(item)
        // console.log('getAdminMargin are updateCoinSelection : ---',getAdminMargin);
        // console.log('updateCoinSelection item are  : ---',item);


        updateWalletSelection(item)
    }

    const getPaymentMethods = () => {
        const qwery = myProfileDetail?.country ? `?country=${myProfileDetail?.country?.toUpperCase()}` : ``//${myCoinDetails?.country?.toLowerCase()}
        Actions.getPaymentMethods(qwery).then((res) => {
            console.log('respons While fething Payment methods', res);
        }).catch((err) => {
            console.log('error While fething Payment methods', err);
        })


    }
    const updateWalletSelection = (data) => {

        let myCoin = myCoinDetails.find(item => item?.name === data?.name)
        // console.log("updateWalletSelection myCoin is ", myCoin)
        // console.log("updateWalletSelection data is ", data)

        // console.log("updateWalletSelection is ", myCoinDetails)
        setWalletCoinDetail(myCoin)
    }
    const updatePaymentMetodArr = (data) => {
        let myPaymentTypes = [...selectedPaymentMetodArr]
        console.log('selected pay item is :--- ', myPaymentTypes)
        const isPaymentTypeExist = selectedPaymentMetodArr.some(el => el?._id === data?._id);
        if (isPaymentTypeExist) {
            const arr = myPaymentTypes.filter(item => item?._id !== data?._id)
            myPaymentTypes = [...arr]
        } else {
            myPaymentTypes.push(data)
        }
        setselectedPaymentMetodArr(myPaymentTypes)
    }

    const toggleCountryModal = () => {
        setIsVisible(!isVisible)
    }

    const onPressAmmontPercent = (value) => {
        // Alert.alert("Ammount percent is", value)
        if (!selectedCoin) {
            showAlertMessage('Please select coin first')
            return
        } else if (walletCoinDetail?.remainingBalance <= 0) {
            showAlertMessage(`Insufficient ${selectedCoin?.symbol?.toUpperCase()} in your wallet`, warning)
            return
        }
        setSelectedPercentage(value)
        let coins = walletCoinDetail?.remainingBalance
        let qty = coins * value / 100
        onChageCoinQty(qty)
        onChangeAmunt(qty)
        console.log('coin qty is :---', qty)
    }

    const onPressSellOrder = () => {
        console.log('minSellPrice', minSellPrice)
        console.log('maxSellPrice', maxSellPrice)
        const finalCoinQty = Number(coinQty) + Number(getAdminMargin)
        const isValid = validateCreteOffer(selectedCoin, coinQty, isSellPatially, maxSellPrice, minSellPrice, countryCode, selectedPaymentMetodArr, title, discription, finalCoinQty)
        {
            (isValid) &&
                setShowModal(true)
        }
    }
    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    const onPressContinue = () => {
        closeAlert()

        const totlCoinAmnt = coinQty * (marketPrice ?? 0)
        // const marginPrice = getPriceInPercent(coinAmnt, ma)
        // let finalPrice = Number(coinAmnt) + Number(marginPrice)
        // const max_sell_Prc = getPriceInPercent(totlCoinAmnt,marginPercentage)
        const finalmaxPrice = maxSellPrice//formatNumberToFixed(totlCoinAmnt, 2)
        const min_sell_Prc = getPriceInPercent(minSellPrice, marginPercentage)
        const finalminPrice = minSellPrice// (minSellPrice - min_sell_Prc).toFixed(2)
        const maxCoinsQty = Number(formatNumberToFixed(formatNumberToFixed(coinQty) - formatNumberToFixed(getAdminMargin)))//
        const minCoinsQty = parseFloat(finalminPrice) / parseFloat(coinSellAt)//calculateSellingCoinsQty({ sellingPrice: finalminPrice, marketPrice: marketPrice }).toFixed(5)
        const adminMargin = formatNumberToFixed(getAdminMargin)
        const payLoad = {
            description: discription,
            title: title,
            payment: selectedPaymentMetodArr.map((item) => item?._id),//?.replace(/ /g, ""),.replace(/ /g, "")
            country: countryCode,
            selling_price: Number(coinAmount),
            // quantity: coinQty,
            coin: selectedCoin?.name,

            maxQuantity: Number(maxCoinsQty),
            minQuantity: Number(minCoinsQty),
            maxAmount: Number(finalmaxPrice),
            minAmount: Number(finalminPrice),
            adminShare: Number(adminMargin),
            sell_partially: isSellPatially.value == Titles.Yes,
            percentage: Number(marginPercentage),
            sell_at_mp: selectedSellAt.value == En.Market_price,
        }
        console.log('payLoad payLoad :---', payLoad)

        createOffer(payLoad)
    }
    const clearData = () => {
        setDiscription('')
        setTitle('')
        setselectedPaymentMetodArr([])
        setCountryCode(Localize.countryCode)
        setSelectedPercentage('')
        setCoinAmount('')
        setcoinQty('')
        setSelectedPercentage('')
        setMinSellPrice('')
        setMaxSellPrice('')
        setMarginPercentage('0')
        setIsSellPatially(sellPartiallyArr[0])
        setSelectedSellAt(sellTypeArr[0])
        setError(undefined)
        if (coinsTypeArr.length > 0) {
            updateCoinSelection()
        } else {
            updateCoinSelection([])
        }

    }

    const createOffer = (data) => {
        setLoading(true);
        Actions.createOffer(data).then((res) => {
            console.log("createOffer response is success res", res)
            showAlertMessage((res?.message) ? (res?.message) : (res?.error), alertType = (res?.error) ? danger : success)
            setLoading(false);
            clearData()
            // NavigationService.navigate(Constants.sells)
            const wt = delayed()
            NavigationService.navigate(Constants.wallet)
        })
            .catch((error) => {
                console.log("", error);
                showAlertMessage(error?.error, danger)
                setLoading(false);

            });
    }
    const onChageCoinQty = (val) => {
        console.log('onChageCoinQty', val)
        if (!selectedCoin && val?.length) {
            const err = { ...error, coinQty: `Please select above coin first which you want to sell` }
            setError(err)
            return
        } else {
            setError('')
        }
        if (Number(val) > Number(walletCoinDetail?.remainingBalance)) {
            const err = { ...error, coinQty: `Insufficint balance in your wallet` }
            
            setError(err)
            return
        }else{
            setError('')
        }
            

        setcoinQty(val && val.toString())
        if (Number(coinQty) <= 0 || coinQty == '') {
            setMinQtySell('0')
        }


        console.log(" coinQty is : -- ", coinQty)
        const coinAmunt = Number(val) * (Number(marketPrice) ?? 0)
        let amnt = parseFloat(coinAmunt)
        let finalStr = formatNumberToFixed(coinAmunt, 2).toString()

        // setCoinAmount(amnt != 0 ? finalStr : '')
        onChangeAmunt(val)
        setError('')
        if (Number(val) <= walletCoinDetail?.remainingBalance) {
            setError('')
        } else {

            const err = { ...error, coinQty: `You not have enough coins you only have create (${(walletCoinDetail?.remainingBalance)} ${selectedCoin?.name}) deal` }
            setError(err)
            //     showAlertMessage("You have not enough balance to share ")
            //     return
        }




    }
    const onChangeAmunt = (val) => {
        const coinAmunt = Number(val) * (Number(marketPrice) ?? 0)
        setMaxSellPrice(formatNumberToFixed(coinAmunt, 2).toString())
        const minPric = parseFloat(coinAmunt) / 100 * parseFloat(10)

        setMinSellPrice(formatNumberToFixed(minPric, 2).toString())

        const marginPrice = (Number(coinAmunt) / 100 * Number(marginPercentage))

        let finalPrice = coinAmunt + marginPrice

        const sellPerCoin = (finalPrice / val)
        console.log('coinQty :--', coinQty);
        console.log('marketPrice :--', marketPrice);
        console.log('coinsAmnt :--', coinAmunt);



        console.log('marginPrice :--', marginPrice);

        console.log('finalPrice :--', finalPrice);

        console.log('sellPerCoin :--', sellPerCoin);


        setCoinSellAt(sellPerCoin)
        const minprice = parseFloat(finalPrice) / 100 * parseFloat(10)
        const minPr = formatNumberToFixed(minprice, 2)//getPriceInPercent(finalPrice, 10)
        const calQty = parseFloat(minPr) / parseFloat(sellPerCoin)
        setMinQtySell(formatNumberToFixed(calQty).toString())

    }
    const onChangePercent = (val) => {

        setMarginPercentage(val.toString())
        if (val == '-') {
            return
        }
        const coinsAmnt = coinQty * (marketPrice)
        const marginPrice = formatNumberToFixed((Number(coinsAmnt) / 100 * Number(val)), 2) //(Number(coinsAmnt) / 100 * Number(val)).toFixed(2)
        let finalPrice = formatNumberToFixed((Number(coinsAmnt) + Number(marginPrice)), 2)// (Number(coinsAmnt) + Number(marginPrice)).toFixed(2)
        // console.log("coinAmunt coinAmunt :----", coinsAmnt)

        // console.log("marginPrice marginPrice :---", marginPrice)

        // console.log("finalPrice finalPrice :----", finalPrice)


        if (val) {

            setMaxSellPrice(formatNumberToFixed(finalPrice, 2).toString())
            const sellPerCoin = Number(finalPrice) / Number(coinQty)
            setCoinSellAt(sellPerCoin)
            const minPrice = parseFloat(finalPrice) / 100 * parseFloat(10)
            const minPric = formatNumberToFixed(minPrice, 2)//getPriceInPercent(finalPrice, 10)
            setMinSellPrice(minPric && minPric.toString())
            setMinQtySell(parseFloat(val) / parseFloat(sellPerCoin))


        } else {
            setMaxSellPrice(formatNumberToFixed(coinsAmnt, 2).toString())
            const minPric = (parseFloat(coinsAmnt) / 100 * parseFloat(10))
            setMinSellPrice(minPric && formatNumberToFixed(minPric, 2).toString())
            // const sellPerCoin = parseFloat(finalPrice)/parseFloat(coinQty)
            setCoinSellAt(marginPrice)
            setMinQtySell(parseFloat(minPric) / parseFloat(marketPrice ?? 0))

            // finalPrice = 
        }

    }


    const validateCreteOffer = (selectedCoin, CoinQty, isSellPatially, maxSellPrice, minSellPrice, country, payment, title, discription, finalQty) => {
       const finalCoinQty =  Number(formatNumberToFixed(formatNumberToFixed(coinQty) + formatNumberToFixed(getAdminMargin)))
        if (!selectedCoin) {
            showAlertMessage("Please select coin first which you want to sell")
            return false
        } else if (!CoinQty) {
            showAlertMessage("Please enter coin Qty")
            return false

        } else if (CoinQty > walletCoinDetail?.remainingBalance) {
            showAlertMessage("Insufficient balance in your account")
            return false
        }
        else if (Number(CoinQty) > Number(finalCoinQty)) {
            showAlertMessage(`You need to add ${getAdminMargin} ${selectedCoin?.symbol?.toUpperCase()} platform charges for creating a deal of ${CoinQty} ${selectedCoin?.symbol?.toUpperCase()} `)
            return false
        }
        else if (isSellPatially.value == Titles.Yes && !minSellPrice) {

            showAlertMessage("Please enter minimum selling Price ")
            return false

        } else if (isSellPatially.value == Titles.Yes && !maxSellPrice) {
            showAlertMessage("Please enter valid minimum selling Price. minimum selling price must be less than max price")
            return false
        }

        else if (isSellPatially.value == Titles.No && !maxSellPrice) {

            showAlertMessage("Please enter selling Price ")
            return false

        }
        else if (!country) {
            showAlertMessage("Please select country")
            return false
        } else if (!payment?.length) {
            showAlertMessage("Please select preffered payment methods")
            return false
        }
        else if (!title) {
            showAlertMessage("Please add offer title")
            return false
        }
        else if (!discription) {
            showAlertMessage("Please add offer discription")
            return false
        }
        else {
            return true
        }
    }

    const getAllCoins = () => {
        setLoading(true);
        Actions.getAllCoins()
            .then((res) => {
                console.log("all coins list res : -- ", res,);
                console.log("all coins list res arr  : -- ", res?.data?.overalldata);
                let coinArr = res?.data?.overalldata
                setcoinsTypeArr(coinArr)
                // updateCoinSelection()
                showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? sucess : warning)
                setLoading(false);
            })
            .catch((error) => {
                console.log("catch error in login is :---- ", error);
                setLoading(false);
                showAlertMessage(message = error?.error, alertType = danger)
            });
    }

    const currencyItemVw = (item) => {
        // let image = `../../Assets/Icons/${item.name}.png
        let myCoin = myCoinDetails.find(val => val?.name?.toLowerCase() === item?.name?.toLowerCase())
        return (
            <View style={{
                overflow: 'hidden', backgroundColor: Colors.bg_textfld_dark, borderRadius: 10, borderWidth: 1.2,
                borderColor: Colors.border_textfld_dark,
            }}>
                <Pressable
                    android_ripple={{ color: Colors.selectedBg, borderless: false }}
                    // underlayColor={Colors.selectedBg}
                    onPress={() => {
                        // enable disable
                        if (item?.coin_status == 'enable') {
                            clearData()
                            updateCoinSelection(item)
                        } else {
                            showAlertMessage(`${item?.name} trade is temporarily stopped`)
                        }
                    }}
                >
                    <View key={item.id} style={{ ...CommonStyles.textfieldContainer, ...styles.currencyItem }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={styles.itemSwichIcon}
                                source={selectedCoin?._id == item?._id ? ImagePath.swith_on : ImagePath.swith_off_double}
                            />
                            <Components.LoaderImage
                                imageUrl={item.logo}
                                style={styles.itemCryptoIcon}
                            />
                            <Text style={{ ...TextStyles.large, ...styles.itemCryptoTitle }} > {item.name}</Text>
                        </View>
                        <Text style={{ ...TextStyles.medium, ...styles.orderDiscript, }} > {formatNumberToFixed(myCoin?.remainingBalance)}</Text>

                    </View>
                </Pressable>
            </View>
        )
    }

  
   
    const MarginPercentComponent = () => {
        return (
            <View style={styles.amountfromWalletContainer}>
                <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{En.Sell_at_customisedPrice}</Text>
                <View
                    style={CommonStyles.textfieldContainer}
                >
                    <Pressable
                        android_ripple={{ color: Colors.selectedBg, borderless: true }}
                        style={{
                            alignItems: 'center', justifyContent: 'center', paddingHorizontal: moderateScale(15),
                            marginEnd: moderateScale(5)
                        }}
                        // disabled={coinQty === '' || (coinQty > 0 && coinQty <= walletCoinDetail?.balance)}

                        onPress={() => {
                            const incr = Number(marginPercentage) - 1
                            console.log(incr)

                            if (coinQty === '') {
                                showAlertMessage('Plese enter coins first', warning)
                            } else if (coinQty <= 0 || parseFloat(coinQty) > parseFloat(walletCoinDetail?.remainingBalance)) {
                                showAlertMessage('Plese enter valid coin Qty', warning)

                            } else {
                                onChangePercent(incr)

                            }
                            // onChangePercent(incr)
                            // setMarginPercentage(incr)

                        }}
                    >
                        <Image
                            style={{ height: moderateScale(18), width: moderateScale(18) }}
                            source={ImagePath.minus}
                            resizeMode='contain'
                        />

                    </Pressable>


                    <TextInput
                        style={{ ...CommonStyles.textInput, flex: 1, alignContent: 'flex-start', marginHorizontal: moderateScale(20), }}
                        // textAlignVertical='top'
                        textAlign='center'
                        multiline
                        placeholder={'0'}
                        placeholderTextColor={Colors.placeholder}
                        value={marginPercentage}
                        maxLength={4}
                        defaultValue='0'
                        keyboardType='numeric'
                        // secureTextEntry={true}
                        editable={coinQty != '' || (coinQty > 0 && coinQty <= walletCoinDetail?.remainingBalance)}
                        onChangeText={onChangePercent}
                    // blurOnSubmit={discription?.substring(discription?.length - 1) == '\n' && discription?.substring(discription?.length - 2) == '\n'}
                    // onChangeText={(val) => setDiscription(val)}
                    />
                    <Pressable
                        android_ripple={{ color: Colors.selectedBg, borderless: true }}
                        style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: moderateScale(10), marginEnd: moderateScale(5) }}
                        // disabled={coinQty === '' || (coinQty > 0 && coinQty <= walletCoinDetail?.balance)}
                        onPress={() => {
                            const incr = Number(marginPercentage) + 1
                            console.log(incr)
                            if (coinQty === '') {
                                showAlertMessage('Plese enter coins first', warning)
                            } else if (coinQty <= 0 || parseFloat(coinQty) > parseFloat(walletCoinDetail?.remainingBalance)) {
                                showAlertMessage('Plese enter valid coin Qty', warning)
                            } else {
                                onChangePercent(incr)
                            }
                            // setMarginPercentage(incr)
                        }}
                    >
                        <Image
                            style={{ height: moderateScale(18), width: moderateScale(18) }}
                            source={ImagePath.plus}
                            resizeMode='contain'
                        />

                    </Pressable>


                    <Text
                        style={{
                            ...TextStyles.medium, flex: 0, textAlign: 'center', borderLeftWidth: 1.2,
                            borderLeftColor: Colors.border_textfld_dark, textAlignVertical: 'center', paddingLeft: moderateScale(15),
                            paddingRight: moderateScale(8),
                        }}>{'%'}</Text>
                </View>
                <Text style={{ ...TextStyles.medium, ...styles.orderDiscript, }}>{`${En.Market_price}:  ${currencySymbol} ${marketPrice ?? 0}`}</Text>

            </View>

        )
    }

    const countyPickerModal = useCallback(() => {
        return (
            <View>
                <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{En.Location}</Text>

                <View
                    style={{
                        ...CommonStyles.textfieldContainer,
                        ...styles.countyPickrContainer, justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>

                    <CountryPicker
                        visible={isVisible}
                        withFlag={true}
                        withFlagButton={true}
                        onSelect={(country) => {
                            console.log(country)
                            setCountryCode(country.cca2)
                            // setCallingCode(country.callingCode[0])
                            // console.log(callingCode)
                        }}
                        withEmoji={false}
                        countryCode={countryCode}
                        withCountryNameButton
                        withFilter

                        containerButtonStyle={{
                            // backgroundColor: 'red',
                            width: width - 50,
                        }}
                    />

                    <Image
                        source={ImagePath.arrowDwn}
                        resizeMode={'contain'}
                        style={{
                            position: 'absolute',
                            height: moderateScale(20),
                            width: moderateScale(18),
                            right: moderateScale(8)
                        }}
                    />
                </View>
            </View>
        )

    }, [countryCode])




    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_White }}>
            <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />
            <Components.CustomPopUp
                onHardwareBackPress={closeAlert}
                onClickTouchOutside={closeAlert}
                scaleAnimationDialogAlert={showModal}
                HeaderTitle={Alerts.ALLERT}
                AlertMessageTitle={'Are you sure you want to create this deal'}
                renderSubtitle={//() =>TitleMessage({coinQty:coinQty,marketPrice:marketPrice,maxSellPrice:maxSellPrice,isSellPatially:isSellPatially,selectedCoin:selectedCoin})
                    <TitleMessage coinQty={coinQty} marketPrice={marketPrice ?? 0} maxSellPrice={maxSellPrice} isSellPatially={isSellPatially}
                        currencySymbol={currencySymbol} selectedCoin={selectedCoin}
                        getAdminMargin={getAdminMargin}
                    />
                }
                leftBtnText={Titles.Cancel}
                rightBtnText={Titles.continue}
                onPressLeftBtn={closeAlert}
                onPressRightBtn={onPressContinue}
            />
            <Components.HeaderComponent headerText={En.sell_crypto} />
            <KeyboardAwareScrollView
                // keyboardShouldPersistTaps={'always'}
                // contentContainerStyle={{ flexGrow: 1 }}
                // enableOnAndroid={true}
                // extraHeight={100}

            >
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        {/* MARK: Header View */}


                        <Text style={{ ...TextStyles.semibold, ...styles.titleWhatYouSell }}>
                            {En.what_you_want_to_sell}
                        </Text>

                        {/* MARK: Coin Selection */}
                        {coinsTypeArr.length > 1 &&
                            <View style={{ gap: moderateScaleVertical(16), marginVertical: moderateScaleVertical(5) }}>
                                {(coinsTypeArr != undefined) && coinsTypeArr?.map((item, index) => currencyItemVw(item))}
                            </View>
                        }

                        <TextInputVw
                            headerText={selectedCoin?.name ?? 'Select Coin'}
                            bottomText={`${En.Available_Amount} ${walletCoinDetail?.remainingBalance ?? '0'}`}
                            value={coinQty}
                            // editable = {Number(walletCoinDetail?.remainingBalance) > 0}
                            placeholder={En.Enter_Manually}
                            onChangeText={(val) => onChageCoinQty(val)}
                        />

                        {(error && error?.coinQty) &&
                            <Text style={{ ...TextStyles.medium, ...styles.error, color: Colors.text_red_dark }}>{error?.coinQty ?? ''}</Text>
                        }


                        {/* {picePercentVw({ onChangeText: setCoinAmount })} */}
                        <PicePercentVw
                        pricePercentArr = {pricePercentArr}
                        selectedPercentage={selectedPercentage}
                        onPressAmmontPercent={(val)=>onPressAmmontPercent(val)}
                        />

                        <MulipeSelectionView
                            optionsArr={sellTypeArr}
                            selectedVal={selectedSellAt}
                            hederTitle={En.Sell_at}
                            onselect={(val) => setSelectedSellAt(val)}

                        />
                        {MarginPercentComponent()}

                        {/* <MarginPercentComponent /> */}

                        <MulipeSelectionView
                            optionsArr={sellPartiallyArr}
                            selectedVal={isSellPatially}
                            hederTitle={En.Do_you_want_to_sell_partially}
                            onselect={(val) => {
                                setError('')
                                setIsSellPatially(val)
                            }}
                        />
                        {(isSellPatially.id == 1) ?

                            <View style={{ flexDirection: 'row', flexGrow: 2, gap: 20, }}>
                                <TextInputVw
                                    containerStyle={{ marginBottom: moderateScale(!error ? 5 : 0), marginTop: moderateScaleVertical(20), flex: 2 }}
                                    headerText={En.Min_Ammount}
                                    bottomText={(minSellPrice && minSellPrice > 0) && `Min coin Qty is ${formatNumberToFixed(minQtySell)}`}
                                    bottomTextStyle={{ textAlign: 'left', }}
                                    value={minSellPrice}
                                    editable={coinQty != '' || (coinQty > 0 && coinQty <= walletCoinDetail?.remainingBalance)}

                                    // defaultValue={minSellPrice}
                                    placeholder={En.Enter_Manually}
                                    onBlur={() => {
                                        // if (!coinQty) {

                                        if (!minSellPrice && isSellPatially.value == Titles.Yes) {
                                            const err = { ...error, minAmount: `Please enter minimum amount` }
                                            setError(err)
                                        }

                                        else if (minSellPrice > maxSellPrice) {
                                            const err = { ...error, minAmount: `Minimum amount not be grater than maximunm amount` }
                                            setError(err)
                                            console.log(err)
                                        } else {
                                            setError('')
                                        }
                                        // } else { setError('') }
                                    }
                                    }
                                    onFocus={() => {


                                        // if (!coinQty) {
                                        //     const err = { ...error, minAmount: `Please enter coin Qty` }
                                        //     setError(err)
                                        //     console.log(err)
                                        // } else { setError('') }
                                    }}
                                    onChangeText={(val) => {
                                        const max = maxSellPrice / 100 * 80
                                        const maxLimit = formatNumberToFixed(max, 2)
                                        setMinSellPrice(val)
                                        setMinQtySell(Number(val) / Number(coinSellAt))

                                        if (Number(val) > Number(marketPrice)) {
                                            const err = { ...error, minAmount: `Minimum not be grater than ${maxLimit} maximunm amount` }
                                            setError(err)
                                            console.log(err)

                                        } else if (Number(val) < Number(maxLimit)) {
                                            setError('')
                                        }
                                        else if (Number(val) < 0) {
                                            const err = { ...error, minAmount: `Minimum not be less than 0` }
                                            setError(err)
                                            console.log(err)
                                        } else {
                                            setError('')
                                        }
                                    }
                                    }
                                />

                                <TextInputVw
                                    containerStyle={{ marginBottom: moderateScale(!error ? 5 : 0), marginTop: moderateScaleVertical(20), flex: 2 }}
                                    headerText={En.Max_Ammmount}
                                    value={maxSellPrice}
                                    textStyle={styles.textGray}
                                    editable={false}
                                    placeholder={En.Enter_Manually}
                                    onChangeText={(val) => {
                                        const blnc = walletCoinDetail?.remainingBalance
                                        const coins = formatNumberToFixed(val) / formatNumberToFixed(marketPrice ?? 0) //calculateSellingCoinsQty({ sellingPrice: val, marketPrice: marketPrice })
                                        const minPrice = getPriceInPercent(val, 10)
                                        // console.log("calculateSellingCoinsQty :---", coins)
                                        setMinSellPrice(formatNumberToFixed(minPrice, 2).toString())
                                        setMaxSellPrice(val)
                                        onChageCoinQty(coins)
                                        if (coins <= blnc) {
                                            setError('')
                                        } else {
                                            const err = { ...error, maxAmount: `You not have enough balance to create maximum ${currencySymbol} ${formatNumberToFixed((walletCoinDetail?.remainingBalance * marketPrice), 2)} deal` }
                                            setError(err)
                                            console.log(err)
                                        }
                                        // setcoinQty(coins.toString())
                                    }
                                    }
                                />

                            </View> :

                            <>
                                <TextInputVw
                                    containerStyle={{ marginBottom: moderateScale(!error ? 5 : 0), marginTop: moderateScaleVertical(20), }}
                                    headerText={`${selectedCoin?.name} ${En.Amount} `}
                                    value={maxSellPrice}
                                    textStyle={styles.textGray}
                                    editable={false}
                                    onChangeText={(val) => {
                                        const blnc = walletCoinDetail?.balance
                                        const coins = formatNumberToFixed(val) / formatNumberToFixed(marketPrice ?? 0) //calculateSellingCoinsQty({ sellingPrice: val, marketPrice: marketPrice })

                                        // const coins = calculateSellingCoinsQty({ sellingPrice: val, marketPrice: marketPrice })
                                        console.log("calculateSellingCoinsQty :---", coins)
                                        setMaxSellPrice(val)
                                        onChageCoinQty(coins)

                                        if (coins <= blnc) {
                                            setError(undefined)
                                        } else {
                                            const err = { ...error, maxAmount: `You not have enough balance to create maximum  ${currencySymbol} ${formatNumberToFixed((walletCoinDetail?.remainingBalance * marketPrice ?? 0), 2)} deal` }
                                            setError(err)
                                            console.log(err)
                                        }
                                        // setcoinQty(coins.toString())
                                    }
                                    }
                                />
                            </>

                        }
                        {(error && (error?.maxAmount || error?.minAmount)) &&
                            <Text style={{ ...TextStyles.medium, ...styles.error, color: Colors.text_red_dark }}>{error?.minAmount ?? ''}</Text>
                        }


                        {((error?.maxAmount || error?.minAmount)) ? <></> :

                            ((maxSellPrice) && (formatNumberToFixed(maxSellPrice, 2, true) > Number((formatNumberToFixed(coinQty) * formatNumberToFixed(marketPrice ?? 0, 2, true)), 2))) ?
                                <Text style={{ ...TextStyles.medium, ...styles.error, color: Colors.text_green }}>{`You have sell this deal ( ${currencySymbol} ${formatNumberToFixed((Number(maxSellPrice) - Number(coinQty) * Number(marketPrice ?? 0)), 2)} ) above market price`}</Text>
                                : (maxSellPrice && (formatNumberToFixed(maxSellPrice, 2, true) < Number((formatNumberToFixed(coinQty) * formatNumberToFixed(marketPrice ?? 0, 2)), 2))) ?
                                    <Text style={{ ...TextStyles.medium, ...styles.error, color: Colors.text_red_dark }}>{`You have sell this deal ( ${currencySymbol} ${formatNumberToFixed((Number(coinQty) * Number(marketPrice ?? 0) - Number(maxSellPrice)), 2)} ) below market price`}</Text>
                                    : ((maxSellPrice) && formatNumberToFixed(coinQty, 2, true) != '' && (Number(formatNumberToFixed(coinQty)) > 0 && Number((Number(formatNumberToFixed(coinQty)) <= formatNumberToFixed(walletCoinDetail?.remainingBalance)), 2))) &&
                                    <Text style={{ ...TextStyles.medium, ...styles.error, color: Colors.text_Yellow }}>{`You have sell this deal as market price`}</Text>
                        }
                        {/* {countyPickerModal()} */}

                        {/* {paymentMetodVw()} */}
                        <PaymentMetodVw
                        paymentTypeArr ={paymentTypeArr}
                        selectedPaymentMetodArr = {selectedPaymentMetodArr}
                        updatePaymentMetodArr = {(item)=>updatePaymentMetodArr(item)}
                        />
                        <TextInputVw
                            headerText={En.Title}
                            placeholder={En.enterTitle}
                            value={title}
                            onChangeText={(val) => setTitle(val)}
                            keyboardType=''
                        />
                        {/* MARK : - Discription container */}
                        <View style={styles.amountfromWalletContainer}>
                            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{En.Description}</Text>
                            <View
                                style={styles.discriptionContainer}
                            >
                                <TextInput
                                    style={{ ...CommonStyles.textInput, flex: 1, alignContent: 'flex-start' }}
                                    textAlignVertical='top'
                                    multiline
                                    placeholder={En.enterDiscription}
                                    placeholderTextColor={Colors.placeholder}
                                    value={discription}
                                    // secureTextEntry={true}
                                    blurOnSubmit={discription?.substring(discription?.length - 1) == '\n' && discription?.substring(discription?.length - 2) == '\n'}
                                    onChangeText={(val) => setDiscription(val)}
                                />
                            </View>
                        </View>

                        <Components.CustomButton title={Titles.Place_Sell_Order}
                            containerStyle={styles.customButton}
                            onPress={() => onPressSellOrder()} />
                        {/* </KeyboardAvoidingView> */}


                    </View>
                </View>
            </KeyboardAwareScrollView>
            {loading && <Components.CustomLoader />}

        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    flex2: {
        flex: 2
    },
    textGray: {
        color: Colors.text_DarkGray
    },
    container: {
        flex: 1,
        backgroundColor: Colors.app_White,
        paddingBottom: moderateScaleVertical(250),
        marginTop: moderateScale(10)
    },
    innerContainer: {
        marginHorizontal: 20,
    },
    titleWhatYouSell: {
        color: Colors.darkGrayTxt,
        marginBottom: moderateScaleVertical(8)
    },
    demo: {
        marginTop: 20
    },
    currencyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
        borderWidth: 0,
        borderColor: Colors.transparent,
        paddingVertical: moderateScale(12)
    },
    itemSwichIcon: {
        overflow: 'hidden',
        height: scale(15),
        width: scale(15),
        resizeMode: 'contain'
        // borderRadius: 100,
    },
    itemPayIcon: {
        overflow: 'hidden',
        height: scale(25),
        width: scale(25),
        resizeMode: 'contain'
        // borderRadius: 100,
    },
    itemCryptoIcon: {
        height: moderateScale(30),
        width: moderateScale(30),
        marginHorizontal: moderateScale(10),
    }, itemCryptoTitle: {
        color: Colors.text_lightBlack
    },
    itemPaymTypeTitle: {
        color: Colors.darkGrayTxt,
        // fontSize:18,
        fontSize: textScale(16),
        marginRight: moderateScale(5)
    }
    ,
    textInput: {
        marginBottom: moderateScale(12),
        marginTop: moderateScaleVertical(20),
    },
    textInputInnerContainer: {
        backgroundColor: Colors.bg_textfld_dark,//bg_textfld_dark
        borderWidth: 1.2
    },
    ammounPercentBox: {
        borderColor: Colors.gradiantDwn,
        borderWidth: 1,
        height: moderateScaleVertical(45),
        width: width / 5,//moderateScale(70),
    },
    fieldHeader: {
        color: Colors.darkGrayTxt,
        marginBottom: moderateScale(10),
        fontSize: textScale(17)

    },
    error: {
        color: Colors.text_red_dark,
        fontSize: 13,
        marginRight: 0,
        // textAlign: 'right',
        marginBottom: moderateScale(20),
        marginTop: moderateScale(5)
    },
    orderDiscript: {
        color: Colors.text_green,
        fontSize: textScale(13),
        marginRight: 0,
        textAlign: 'right',
        marginTop: moderateScale(5)
    },
    amountfromWalletContainer: {
        marginTop: moderateScaleVertical(10),
        marginBottom: moderateScale(12),
    },
    sellAtContainer: {
        marginTop: moderateScaleVertical(5)
    },
    paymentMethod: {
        height: moderateScale(40),
        // justifyContent:'center',
        gap: moderateScale(8),
        paddingHorizontal: moderateScale(10),
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 0,
        backgroundColor: Colors.bg_textfld_dark,
        borderColor: Colors.border_textfld_dark
    },
    discriptionContainer: {
        backgroundColor: Colors.bg_textfld_dark, borderRadius: 10,
        borderColor: Colors.border_textfld_dark, borderWidth: 1.2,
        height: moderateScale(150), paddingHorizontal: moderateScale(10), paddingVertical: moderateScaleVertical(5)
    },
    customButton: {
        marginTop: moderateScale(50),
    },
    countyPickrContainer: {
        backgroundColor: Colors.bg_textfld_dark,
        // flexDirection: 'row',
        // alignItems: 'center',
        // flex: 1,
        paddingVertical: moderateScale(10),
        marginBottom: moderateScale(10)
    }, higlighText: {
        ...TextStyles.small,
        fontFamily: AppFonts.bold,
        color: Colors.text_lightBlack,
        fontSize: textScale(14)
    },
});

//make this component available to the app
export default Sells;