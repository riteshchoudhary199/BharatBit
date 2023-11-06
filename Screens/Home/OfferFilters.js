//import liraries
import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, Alert, TextInput, StatusBar } from 'react-native';
import { CommonStyles, TextStyles } from '../../Styles/ComnStyle';
import { height, moderateScale, moderateScaleVertical, scale, width } from '../../Styles/responsiveSize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Components from "../../Components/indexx"
import { Titles, En, ImagePath, Colors, Constants, ImageEnum } from '../../Constants/index';
import Actions from '../../Redux/Actions';
import { showAlertMessage, success, danger, print, getIconUrl, currencySymbol } from '../../Utils/helperFunctions';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CountryPicker from "react-native-country-picker-modal";

export const PaymentMetodVw = ({ paymentTypeArr, selectedPaymentMetodArr, updatePaymentMetodArr }) => {

    return (
        <View style={styles.amountfromWalletContainer}>

            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader, marginTop: moderateScale(10), }}>{En.PayMent_Methods}</Text>
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

// create a component
const OfferFilters = ({ navigation, route }) => {
    const lastData = route?.params
    console.log("lastData is :---- ", lastData);
    const homeRedux = useSelector((state) => state?.homeReducer)
    const allCoinsList = homeRedux?.allCoinsList
    const applyFilters = homeRedux?.offerFilter

    console.log("applyFilters in filter screeen are  :---- ", applyFilters);
    let PaymentTypeArr = [En.UPI, En.Bank_transfer, En.IMPS, En.RTGS, En.PayPal, En.PhonePe]
    let pricePercentArr = [
        { id: 1, pricePercent: 25 },
        { id: 2, pricePercent: 50 },
        { id: 3, pricePercent: 75 },
        { id: 4, pricePercent: 100 }
    ]
    // const [lastScrnData, setlastScrnData] = useState(lastData)
    const [selectedCoin, setSelectedCoin] = useState(undefined)//'
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState("");
    const [isVisible, setIsVisible] = useState(false)
    const [sortType, setSortType] = useState('')
    const [selectedPaymentMetodArr, setselectedPaymentMetodArr] = useState([])
    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    const walletReducer = useSelector((state) => state?.wallet)
    const paymentTypeArr = walletReducer?.paymentMethods

    const sortArr = [{ title: 'Low to High', _id: 'Low to High' },
    { title: 'High to Low', _id: 'High to Low' },]

    useEffect(() => {
        if (allCoinsList?.length <= 1) {
            getAllCoins()
        }
        getPaymentMethods()
        console.log("data from last screens selected filters are :---- ", lastData)
        updateStates(applyFilters?.filterData)

    }, []);

    useEffect(() => {
        getPaymentMethods()
    }, [countryCode]);
    const onSelectDropDown = (item) => {
        setSortType(item)
    }
    const getPaymentMethods = () => {
        setLoading(true)
        const orign = myProfileDetail?.country ? myProfileDetail?.country?.toUpperCase() : ''
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
    const getAllCoins = async () => {
        await Actions.getAllCoins()
            .then((res) => {
                let coinArr = res?.data?.overalldata
                setcoinsTypeArr(coinArr)
                // updateCoinSelection(coinArr[0])
                showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? sucess : warning)
                setLoading(false);
            })
            .catch((error) => {
                console.log("catch error in login is :---- ", error);
                setLoading(false);
                showAlertMessage(message = error?.error, alertType = danger)
            });
    }
    const resetFilters = () => {
        setCountryCode('')
        setSortType('')
        updateCoinSelection(undefined)
        setselectedPaymentMetodArr([])
        Actions.updateOferFilter({})
        // setIsFilterApply(false)
    }
    const updateStates = (data) => {
        const coin = allCoinsList.find(item => item?.name === data?.crypto)
        console.log("selected coin is : --", coin)
        updateCoinSelection(coin)
        const type = sortArr.find(item => item?.title === data?.price_sort)

        // setSortType(data?.price_sort ? type : "")
        setSortType(type || '')
        setselectedPaymentMetodArr(data?.paymentMethods ?? [])

        console.log('type of sort is ', sortType)
        setCountryCode(data?.country || '')
    }
    const onPressApplyFilter = (item) => {
        let filterObj = {
            crypto: selectedCoin?.name,
            country: countryCode,
            price_sort: sortType?.title,
            paymentMethods: selectedPaymentMetodArr
        }
        if (!selectedCoin?.name && !countryCode && !sortType?.title && !selectedPaymentMetodArr.length) {
            showAlertMessage('Please select filter first')
            return
        }
        const data = { isApply: true, filterData: filterObj }
        Actions.updateOferFilter(data)
        navigation.navigate(lastData.screen,)
    }
    const updateCoinSelection = (item) => {
        setSelectedCoin(item)
    }

    const toggleCountryModal = () => {
        setIsVisible(!isVisible)
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

    const currencyItemVw = (item) => {
        return (
            <>
                <TouchableHighlight
                    style={{
                        backgroundColor: Colors.bg_textfld_dark, borderRadius: 10, borderWidth: 1.2,
                        borderColor: Colors.border_textfld_dark,
                    }}
                    underlayColor={Colors.selectedBg}
                    onPress={() => setSelectedCoin(item)}
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

            <Components.HeaderComponent contanerStyle={{ backgroundColor: Colors.app_White, marginBottom: moderateScale(0) }}
                subHeaderStyle={{ marginBottom: moderateScale(0) }}
                headerText={En.Filter}
                subHeaderText=""
                showLeftArrow={true}
                navigation={navigation}
            />
            <View
                style={{ alignItems: 'flex-end', paddingRight: moderateScale(20) }}
            >
                <TouchableHighlight
                    onPress={() => resetFilters}
                // onPress={resetFilters}
                // style={{backgroundColor:'red'}}
                >
                    <Components.GradientText
                        onPress={resetFilters}
                        style={{ ...TextStyles.medium }}

                    >Reset</Components.GradientText>

                </TouchableHighlight>
            </View>

            <KeyboardAwareScrollView>
                <View style={styles.container}>
                    <View style={{ ...styles.innerContainer, gap: 20 }}>
                        {/* MARK: Header View */}
                        <View>
                            <Text style={{ ...TextStyles.semibold, ...styles.titleWhatYouSell }}>
                                {En.what_you_want_to_sell}
                            </Text>

                            {/* MARK: Coin Selection */}
                            {allCoinsList.length > 1 &&
                                <View style={{ gap: moderateScaleVertical(16), marginVertical: moderateScaleVertical(5) }}>
                                    {(allCoinsList != undefined) && allCoinsList?.map((item, index) => currencyItemVw(item))}
                                </View>
                            }
                        </View>

                        <View>
                            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{"Location"}</Text>
                            {countyPickerModal()}
                        </View>

                        <Components.DropDownField
                            data={sortArr}
                            defaultValue={sortType}
                            placeholderText={En.SortedBy}
                            labelHeaderText={En.Price}
                            headerTextStyle={{ ...styles.subtitleStyle, marginBottom: moderateScale(5), }}
                            containerStyle={{
                                marginBottom: moderateScale(10)
                            }}
                            onSelecton={onSelectDropDown}
                            isSearch={false}
                            dropdownStyle={{ ...styles.textInputInnerContainer, backgroundColor: Colors.bg_textfld_dark, }}
                        />
                        <PaymentMetodVw
                            paymentTypeArr={paymentTypeArr}
                            selectedPaymentMetodArr={selectedPaymentMetodArr}
                            updatePaymentMetodArr={(item) => updatePaymentMetodArr(item)}
                        />
                        {/* MARK : - Place sell order button container */}
                        <Components.CustomButton title={Titles.Apply}
                            containerStyle={styles.customButton}
                            onPress={() => onPressApplyFilter()} />
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
    }, subtitleStyle: {
        color: 'rgba(101, 101, 101, 0.5)',
        // marginTop: moderateScaleVertical(15),
        // marginBottom: moderateScaleVertical(20),
        fontSize: moderateScale(15)
    }
});

//make this component available to the app
export default OfferFilters;
