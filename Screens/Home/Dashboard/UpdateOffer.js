//import liraries
import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, Alert, TextInput, StatusBar } from 'react-native';
import { CommonStyles, TextStyles } from '../../../Styles/ComnStyle';
import { height, moderateScale, moderateScaleVertical, scale, width } from '../../../Styles/responsiveSize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Components from "../../../Components/indexx"
import { Titles, En, ImagePath, Colors, ImageEnum } from '../../../Constants/index';
import Actions from '../../../Redux/Actions';
import { showAlertMessage, success, danger, print, getIconUrl, currencySymbol } from '../../../Utils/helperFunctions';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CountryPicker from "react-native-country-picker-modal";
import NavigationService from '../../../Services/NavigationService';


// create a component
const UpdateOffer = ({ navigation, route }) => {
    const lastData = route?.params
    console.log("lastData is :---- ", lastData);
    const allCoinsList = useSelector((state) => state?.homeReducer?.allCoinsList)
    let PaymentTypeArr = [En.UPI, En.Bank_transfer, En.IMPS, En.RTGS, En.PayPal, En.PhonePe]
    let pricePercentArr = [
        { id: 1, pricePercent: 25 },
        { id: 2, pricePercent: 50 },
        { id: 3, pricePercent: 75 },
        { id: 4, pricePercent: 100 }
    ]


    const [OfferDetail, setOfferDetail] = useState({})
    const [lastScrnData, setlastScrnData] = useState(lastData)
    const [selectedCoin, setSelectedCoin] = useState()//'
    const [selectedPaymentMetodArr, setselectedPaymentMetodArr] = useState([])
    const [coinAmount, setCoinAmount] = useState("")
    const [coinQty, setcoinQty] = useState("")
    const [title, setTitle] = useState('')
    const [discription, setDiscription] = useState("")
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState("");
    const [isVisible, setIsVisible] = useState(false)
    const [walletCoinDetail, setWalletCoinDetail] = useState('')
    const [selectedPercentage, setSelectedPercentage] = useState('')
    const [currencyName, setCurrencyName] = useState('')


    const myCoinDetails = useSelector((state) => state?.auth?.coinDetails)
    const walletReducer = useSelector((state) => state?.wallet)
    const coinDetails = walletReducer?.coinsDetails
    const paymentTypeArr = walletReducer?.paymentMethods
    const curretCoin = selectedCoin?.name === 'USDT' ? 'tether' : selectedCoin?.name?.toLowerCase()
    const selectLiveCoin = Object.hasOwn(coinDetails, curretCoin) ? coinDetails[curretCoin ?? ''] : ''
    const marketPrice = Object.hasOwn(selectLiveCoin, currencyName?.toLowerCase()) ? selectLiveCoin[currencyName?.toLowerCase()] : selectLiveCoin['usd']
    const currencySymbol = OfferDetail?.currency_symbol//'$'



    // const [coinsTypeArr, setcoinsTypeArr] = useState(allCoinsList)

    // const myCoinDetails = useSelector((state) => state?.auth?.coinDetails)


    console.log("my allCoinsList details are : ---", allCoinsList);

    useEffect(() => {
        Actions.userProfileAction()
        if (allCoinsList?.length <= 0) {
            Actions.getAllCoins()
        }
        getOfferDetail()
        // setcoinsTypeArr(allCoinsList)
    }, [lastScrnData]);
    // const getAllCoins = async () => {
    // await Actions.getAllCoins()
    // .then((res) => {
    //     let coinArr = res?.data?.overalldata
    //     setcoinsTypeArr(coinArr)
    //     // updateCoinSelection(coinArr[0])
    //     showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? sucess : warning)
    //     setLoading(false);
    // })
    // .catch((error) => {
    //     console.log("catch error in login is :---- ", error);
    //     setLoading(false);
    //     showAlertMessage(message = error?.error, alertType = danger)
    // });
    // }
    useEffect(() => {

    }, [countryCode])


    useEffect(() => {
        getPaymentMethods()
    }, [countryCode]);

    const getPaymentMethods = () => {
        setLoading(true)
        const orign = myCoinDetails?.country ? myCoinDetails?.country?.toUpperCase() : ''
        const cntry = countryCode ? countryCode : orign
        const qwery = cntry ? `?country=${cntry.toUpperCase()}` : ``//${myCoinDetails?.country?.toLowerCase()}
        Actions.getPaymentMethods(qwery).then((res) => {
            console.log('respons While fething Payment methods', res);
            setLoading(false)
        }).catch((err) => {
            console.log('error While fething Payment methods', err);
            setLoading(false)
        })
    }

    // const getPaymentMethods = () => {
    //     const qwery = myCoinDetails?.country ? `?country=India` : `?country=India`//${myCoinDetails?.country?.toLowerCase()}
    //     Actions.getPaymentMethods(qwery).then((res) => {
    //         console.log('respons While fething Payment methods', res);
    //     }).catch((err) => {

    //         console.log('error While fething Payment methods', err);
    //     })
    // }
    const getOfferDetail = async () => {
        setLoading(true)
        const payLoad = lastScrnData?.params
        console.log("lastData lastData lastData is :---- ", lastScrnData);
        await Actions.getAnOfferDetail(lastData).then((res) => {
            console.log("res while make getOfferDetail is : --", res)
            const data = res?.data?.offer[0]
            console.log("data getOfferDetailis : --", data)
            updateStates(data)
            setOfferDetail(data)
            setLoading(false)
            // const msg = res?.message ? res.message : res.error
            // showAlertMessage(msg, success)
        }).catch((err) => {
            console.log("error from make transaction is : --", err)
            const msg = err?.message ? err.message : err.error
            setLoading(false)
            showAlertMessage(msg)
        })
    }
    const updateStates = (data) => {
        setselectedPaymentMetodArr(data?.pay_details)
        const coin = allCoinsList.find(item => item?.name === data?.coin)
        console.log("selected coin is : --", coin)
        setcoinQty(data?.maxQuantity?.toString() || '')
        setCoinAmount(data?.maxAmount?.toString() || '')
        setTitle(data?.title?.toString() || '')
        setDiscription(data?.description || '')
        updateCoinSelection(coin)
        setCurrencyName(data?.currency_name)
        // setCountryCode(data?.country || 'IN')
        setCountryCode(data?.country)
    }

    const updateCoinSelection = (item) => {
        setSelectedCoin(item)
        updateWalletSelection(item)
    }
    const updateWalletSelection = (data) => {
        let myCoin = myCoinDetails.find(item => item?.name === data?.name)
        console.log("updateWalletSelection is ", myCoin)
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
        setSelectedPercentage(value)
        let coins = walletCoinDetail.remainingBalance
        let qty = coins * value / 100
        onChageCoinQty(qty)
        console.log('coin qty is :---', qty)
    }

    const onPressSellOrder = () => {
        const payLoad = {
            edit_id: OfferDetail?._id,
            description: discription,
            title: title,
            payment: selectedPaymentMetodArr.map((item) => item._id),//?.replace(/ /g, ""),
            // country: countryCode,
        }
        console.log("payLoad values are : --- ", payLoad)
        const isValid = validateCreteOffer(selectedCoin, coinQty, coinAmount, countryCode, selectedPaymentMetodArr, title, discription)
        console.log("isValid values : --- ", isValid)
        {
            (isValid) &&
                updateOffer(payLoad)
        }

    }

    const onChageCoinQty = (val) => {
        if (val <= walletCoinDetail.remainingBalance) {
            setcoinQty(val.toString())
            console.log(" coinQty is : -- ", coinQty)
            const coinAmunt = val * (selectedCoin?.inrLivePrice)
            let amnt = parseFloat(coinAmunt)
            let finalStr = coinAmunt.toFixed(2).toString()
            setCoinAmount(amnt != 0 ? finalStr : '')
        } else {
            showAlertMessage("You have not enough balance to share ")
            return false
        }
    }

    const validateCreteOffer = (selectedCoin, CoinQty, ammount, country, payment, title, discription) => {
        if (!selectedCoin) {
            showAlertMessage("Please select coin first which you want to sell")
            return
        } else if (!CoinQty) {
            showAlertMessage("Please add coin Qty")
            return false

        } else if (!ammount) {
            showAlertMessage("Please add coin amount")
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

    const updateOffer = (data) => {
        Actions.updateOffer(data).then((res) => {
            console.log("createOffer response is success res", res)
            Actions.setDefaultStorage
            showAlertMessage((res?.message) ? (res?.message) : (res?.error), alertType = (res?.error) ? danger : success)
            setLoading(false);
            NavigationService.goBack()

        })
            .catch((error) => {
                console.log("", error);
                showAlertMessage(error?.error, alertType = danger)
                setLoading(false);

            });
    }

    const currencyItemVw = (item) => {
        // let image = `../../Assets/Icons/${item.name}.png
        console.log('currencyItemVw item is : ---', item)
        return (
            <>
                <TouchableHighlight
                    style={{
                        backgroundColor: Colors.bg_textfld_dark, borderRadius: 10, borderWidth: 1.2,
                        borderColor: Colors.border_textfld_dark,
                    }}
                    underlayColor={Colors.selectedBg}
                // onPress={() => updateCoinSelection(item)}
                >
                    <View key={item.id} style={{ ...CommonStyles.textfieldContainer, ...styles.currencyItem }}>
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
                </TouchableHighlight>
            </>
        )
    }

    const textInputVw = ({ textValue, onChangeText = () => { }
        , placeholder = En.Enter_Manually, headerText, bottomText, containerStyle, keyboardType = 'decimal-pad', editable = true }) => {
        return (
            <View style={{ ...styles.textInput, containerStyle }}>
                <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{headerText}</Text>
                <Components.CustomTextInput
                    innerContainerStyle={styles.textInputInnerContainer}
                    value={textValue}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    isshowLeftImg={false}
                    editable={editable}
                />
                {
                    bottomText &&
                    <Text style={{ ...TextStyles.medium, ...styles.orderDiscript }}>{bottomText}</Text>
                }
            </View>
        )

    }

    const picePercentVw = () => {
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
                    // onPress={() => onPressAmmontPercent(item.pricePercent)}
                    />)}

                </View>
            </View>
        )
    }
    const paymentMetodVw = () => {

        return (
            <View style={styles.amountfromWalletContainer}>
                <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{En.Amount_From_Wallet}</Text>
                {(paymentTypeArr.length > 0) ?

                    <>



                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: moderateScaleVertical(16) }}>
                            {paymentTypeArr.map((item, index) => {
                                const isSelected = selectedPaymentMetodArr?.filter(data => data?._id == item?._id)
                                const typeImage = item?.image?.includes('http') ? item?.image : ImagePath + item?.image

                                return (
                                    <TouchableHighlight //>
                                        underlayColor={Colors.transparent}
                                        onPress={() =>
                                            updatePaymentMetodArr(item)
                                        }
                                    >
                                        <View style={styles.paymentMethod}>


                                            {/* <Components.LoaderImage
                                                imageUrl={Image.resolveAssetSource(isSelected?.length ? ImagePath.chek : ImagePath.payType).uri}
                                                p
                                                style={{ ...styles.itemSwichIcon }}
                                                indicatorSize={'small'}
                                                resizeMode={ImageEnum.contain}
                                            /> */}

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
                                            {/* <Components.LoaderImage
                                        imageUrl={isSelected?.length ? Image.resolveAssetSource(ImagePath.chek).uri : item?.image.includes('http') ? item?.image : `${ImagePath}${item?.image}`}
                                        placeHolderUrl={Image.resolveAssetSource(ImagePath.payType).uri}
                                        style={isSelected?.length ? styles.itemSwichIcon : styles.itemPayIcon}
                                        indicatorSize={'small'}
                                        resizeMode={isSelected?.length ? ImageEnum.contain : ImageEnum.cover}
                                    /> */}
                                            {/* <Image source={isSelected?.length ? ImagePath.chek : ImagePath.unCheck} style={{ ...styles.itemSwichIcon }} /> */}

                                            {/* {getSelectedImage(item?.paymentMethodType)} */}
                                            <Text style={{ ...TextStyles.medium, ...styles.itemPaymTypeTitle, }}
                                            >{item?.name ?? ''}</Text>
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

    const countyPickerModal = useCallback(() => {
        return (
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
        )

    }, [countryCode])


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_White }}>
            <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />

            {/* <Components.HeaderComponent headerText={En.sell_crypto} /> */}

            <Components.HeaderComponent contanerStyle={{ backgroundColor: Colors.app_White }}
                subHeaderStyle={{ marginBottom: moderateScale(0) }}
                headerText={En.Modify_Offer}
                showLeftArrow={true}
                navigation={navigation}
            />

            <KeyboardAwareScrollView>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        {/* MARK: Header View */}

                        <Text style={{ ...TextStyles.semibold, ...styles.titleWhatYouSell }}>
                            {En.what_you_want_to_sell}
                        </Text>

                        {/* MARK: Coin Selection */}
                        {allCoinsList.length > 1 &&
                            <View style={{ gap: moderateScaleVertical(16), marginVertical: moderateScaleVertical(5) }}>
                                {(allCoinsList != undefined) && allCoinsList?.map((item, index) => currencyItemVw(item))}
                            </View>
                        }
                        {textInputVw({
                            headerText: `${selectedCoin?.name || ''}`,
                            bottomText: `${En.Available_Amount} ${walletCoinDetail?.remainingBalance}`,
                            textValue: coinQty,
                            editable: false,
                            onChangeText: (val) => onChageCoinQty(val),
                        })}

                        {picePercentVw({ onChangeText: setCoinAmount })}

                        {textInputVw({
                            headerText: `${selectedCoin?.name || ''} ${En.Amount} `,
                            bottomText: `${En.Market_price}  ${currencySymbol} ${marketPrice || ''}`,
                            textValue: coinAmount,
                            editable: false,
                            // onChangeText: (val) => setcoinQty(val)
                            onChangeText: setCoinAmount

                        })}

                        {/* {countrySelector()} */}
                        {countyPickerModal()}
                        {paymentMetodVw()}


                        {textInputVw({
                            headerText: En.Title, textValue: title,
                            placeholder: En.enterTitle,
                            keyboardType: 'email-address',
                            onChangeText: (val) => setTitle(val)
                        })}

                        {/* MARK : - Discription container */}
                        <View style={styles.amountfromWalletContainer}>
                            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{En.Description}</Text>
                            <View
                                style={styles.discriptionContainer}
                            >
                                <TextInput
                                    style={{ ...CommonStyles.textInput, flex: 0 }}
                                    multiline
                                    placeholder={En.enterDiscription}
                                    placeholderTextColor={Colors.placeholder}
                                    value={discription}
                                    onChangeText={(val) => setDiscription(val)}
                                />
                            </View>
                        </View>
                        {/* MARK : - Place sell order button container */}
                        <Components.CustomButton title={Titles.Update_Place_Sell_Order}
                            containerStyle={styles.customButton}
                            onPress={() => onPressSellOrder()} />
                    </View>
                </View>
            </KeyboardAwareScrollView>
            {loading && <Components.CustomLoader />}

        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.app_White,
        paddingBottom: 150,
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
        backgroundColor: Colors.transparent,
        borderWidth: 0,
        borderColor: Colors.transparent,
        paddingVertical: moderateScale(12)
    },
    itemSwichIcon: {
        overflow: 'hidden',
        height: scale(15),
        width: scale(15),
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
        marginRight: 5
    }
    ,
    textInput: {
        marginBottom: moderateScale(12),
        marginTop: moderateScaleVertical(20),
    },
    textInputInnerContainer: {
        backgroundColor: Colors.bg_textfld_dark,
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

    },
    orderDiscript: {
        color: Colors.text_green,
        fontSize: 13,
        marginRight: 0,
        textAlign: 'right',
        marginTop: moderateScale(5)
    },
    amountfromWalletContainer: {
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
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingVertical: moderateScale(10),
        marginBottom: moderateScale(10)
    },
});

//make this component available to the app
export default UpdateOffer;
