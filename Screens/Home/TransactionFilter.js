
//import liraries
import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, Alert, TextInput, StatusBar, Pressable } from 'react-native';
import { CommonStyles, TextStyles } from '../../Styles/ComnStyle';
import { height, moderateScale, moderateScaleVertical, scale, textScale, width } from '../../Styles/responsiveSize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Components from "../../Components/indexx"
import { Titles, En, ImagePath, Colors, Constants, AppFonts, Alerts } from '../../Constants/index';
import Actions from '../../Redux/Actions';
import { showAlertMessage, success, danger, print, getIconUrl, currencySymbol } from '../../Utils/helperFunctions';
import { useSelector } from 'react-redux';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import CountryPicker from "react-native-country-picker-modal";
import { text } from 'stream/consumers';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

export const DatePickerTextInput = ({ containerStyle, fieldStyle, headerText, value, onFocus }) => {

    return (

        <View style={{ gap: 5, ...containerStyle }}>
            <Text style={{ ...TextStyles.regular, color: Colors.text_Black }}>{headerText}</Text>

            <Pressable
                android_ripple={{ color: Colors.selectedBg }}
                onPress={onFocus}
                style={{
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: Colors.app_Black,
                    maxHeight: 35,
                    justifyContent: 'center',
                    paddingVertical: moderateScaleVertical(6),
                    paddingHorizontal: moderateScale(5)
                    , ...fieldStyle
                }}
            >
                <Text style={{ fontFamily: AppFonts.medium, fontSize: 14, color: value ? Colors.text_Black : Colors.placeholder }}>
                    {value ?? 'Select date'}

                </Text>



            </Pressable>
            {/* <TextInput
                style={{
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: Colors.app_Black,
                    maxHeight: 35,
                    fontFamily: AppFonts.medium,
                    fontSize: 14,
                    textAlignVertical: 'center'
                    , ...fieldStyle
                }}
                multiline={false}
                placeholderTextColor={Colors.placeholder}
                placeholder='select date'
                value={value}
                onChange={onChangeText}
                onFocus={onFocus}
            /> */}
        </View>

    )

}
// create a component
const TransactionFilter = ({ navigation, route }) => {
    const lastData = route?.params
    console.log("lastData is :---- ", lastData);
    const homeRedux = useSelector((state) => state?.homeReducer)
    // const allCoinsList = homeRedux?.allCoinsList
    const applyFilters = homeRedux?.transactionFilter

    console.log("applyFilters in filter screeen are  :---- ", applyFilters);

    const filterTypeArr = [{ id: 1, value: 'transaction_Type', title: 'Transaction Type', enabled: lastData.screen == Constants.Transactions, subArray: [{ id: 1, value: 'withdraw', title: 'Withdraw' }, { id: 2, value: 'deposit', title: 'Deposit' },{ id:3, value: 'transfer', title: 'Transfer' }] },
    { id: 2, value: 'date_Range', title: 'Date Range', enabled: true, subArray: [] },
    { id: 3, value: 'crypto', title: 'Crypto', enabled: true, subArray: [{ id: 1, value: 'Bitcoin', title: 'Bitcoin' }, { id: 2, value: 'Ethereum', title: 'Ethereum' }, { id: 3, value: 'USDT', title: 'USDT' }] },
    {
        id: 4, value:'transaction_Status', title: lastData.screen == Constants.Transactions ? 'Transaction Status' : 'Trade Status', enabled: true, subArray: [{ id: 1, value: 'successful', title: 'Successful' }, { id: 2, value: 'cancelled', title: 'Cancelled' }, { id: 3, value: 'pending', title: 'Pending' },

        ]
    }]

    const mainFiltersArr = filterTypeArr.filter((el) => el.enabled)

    const [loading, setLoading] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState('')
    const [selectedMainFilter, setSelectedMainFilter] = useState(mainFiltersArr[0])
    const [selectedTransTypes, setSelectedTransTypes] = useState([])
    const [selectedCryptoTypes, setSelectedCryptoTypes] = useState([])
    const [selectedTransStatus, setSelectedTransStatus] = useState([])
    const [selectedDateFilter, setSelectedDateFilter] = useState({ from: '', to: '' });
    const [showModal, setShowModal] = useState(false)

    const isFocused = useIsFocused();
    // const [lastScrnData, setlastScrnData] = useState(lastData)


    useEffect(() => {
        console.log("data from last screens selected filters are :---- ", lastData)
        if (applyFilters) {
            // setSelectedTransTypes(data?.tranSactionType)
            // setSelectedTransStatus(data?.transactionStatus)
            // setSelectedDateFilter(data?.dateRange)
            // setSelectedCryptoTypes(data?.cryptoType)
            updateStates(applyFilters)
        }
        console.log("data from applyFilters applyFilters are :---- ", applyFilters)

    }, []);


    const closeAlert = () => {
        setShowModal(false)
        return true
    }
    const onPressConfirm = async () => {
        closeAlert()
        resetFilters()

    }

    const onPressCancelBtn = () => {
        if (selectedTransTypes.length > 0 || selectedCryptoTypes.length > 0 || selectedTransStatus.length > 0 || selectedDateFilter.from || selectedDateFilter.to) {
            setShowModal(true)

        } else {
            const data = { screen: lastData.screen ?? '', tranSactionType: selectedTransTypes, cryptoType: selectedCryptoTypes, transactionStatus: selectedTransStatus, dateRange: selectedDateFilter }
        Actions.updateTransactionFilters(data)
        navigation.navigate(lastData.screen,)

        }
    }
    const resetFilters = () => {
        setSelectedTransTypes([])
        setSelectedTransStatus([])
        setSelectedDateFilter({ from: '', to: '' })
        setSelectedCryptoTypes([])
        const data = { screen: lastData ?? '', tranSactionType: [], cryptoType: [], transactionStatus: [], dateRange: { from: '', to: '' } }
        Actions.updateTransactionFilters({ screen: lastData ?? '', tranSactionType: [], cryptoType: [], transactionStatus: [], dateRange: { from: '', to: '' } })
        navigation.navigate(lastData.screen,)
    }

    const updateStates = (data) => {
        if (data?.screen !== lastData?.screen) {
            Actions.updateTransactionFilters({ screen: lastData ?? '', tranSactionType: [], cryptoType: [], transactionStatus: [], dateRange: { from: '', to: '' } })
            setSelectedTransTypes([])
            setSelectedTransStatus([])
            setSelectedDateFilter({ from: '', to: '' })
            setSelectedCryptoTypes([])
        } else {
            setSelectedTransTypes(data?.tranSactionType)
            setSelectedTransStatus(data?.transactionStatus)
            setSelectedDateFilter(data?.dateRange)
            setSelectedCryptoTypes(data?.cryptoType)
        }
    }
    const onPressApplyFilter = (item) => {

        if (!selectedTransTypes.length && !selectedCryptoTypes.length && !selectedTransStatus.length && !selectedDateFilter.from && !selectedDateFilter.to) {
            showAlertMessage('Please select filter first')
            return
        } else if (selectedDateFilter.from && !selectedDateFilter.to) {
            showAlertMessage('Please select valid date')
            return
        } else if (!selectedDateFilter.from && selectedDateFilter.to) {
            showAlertMessage('Please select valid date')
            return
        }
        // const data = { isApply: true, filterData: filterObj }
        const data = { screen: lastData.screen ?? '', tranSactionType: selectedTransTypes, cryptoType: selectedCryptoTypes, transactionStatus: selectedTransStatus, dateRange: selectedDateFilter }
        Actions.updateTransactionFilters(data)
        navigation.navigate(lastData.screen,)
    }

    const showDatePicker = (field) => {
        setDatePickerVisibility(true);
        setSelectedDateField(field)
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        if (selectedDateField === 'From') {
            const modiDate = moment(date).format('DD/MM/YYYY')
            const nowDate = moment().format('DD/MM/YYYY')
            if (selectedDateFilter.to == '') {
                const data = { ...selectedDateFilter, from: modiDate, to: nowDate }
                setSelectedDateFilter(data)
            } else {
                const data = { ...selectedDateFilter, from: modiDate }
                setSelectedDateFilter(data)
            }

        } else {
            const modiDate = moment(date).format('DD/MM/YYYY')

            const data = { ...selectedDateFilter, to: modiDate }
            setSelectedDateFilter(data)
        }
        hideDatePicker();
    };



    const onSelectMainFilter = (item) => {
        setSelectedMainFilter(item)

    }

    const FilterTypeItem = ({ item }) => {

        return (
            <>
                <Pressable
                    android_ripple={{ color: Colors.selectedBg, borderless: false }}
                    onPress={() => onSelectMainFilter(item)}
                >
                    <View style={{ justifyContent: 'center', marginLeft: 10, paddingVertical: 8 }}>
                        {(item.value == selectedMainFilter.value) ?
                            <Components.GradientText
                                colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                                onPress={() => onSelectMainFilter(item)}
                                style={{
                                    fontFamily: AppFonts.regular,
                                    fontSize: textScale(15),
                                    color: Colors.text_Black
                                }}
                            >
                                {item?.title}
                            </Components.GradientText> :
                            <Text style={{ ...TextStyles.regular, color: Colors.text_lightBlack }}>{item?.title}</Text>
                        }
                    </View>

                    {item?.id == filterTypeArr?.length &&
                        <View style={{ height: 1.2, backgroundColor: Colors.seprator }} />
                    }
                </Pressable>
            </>

        )
    }





    const onSelectTransType = (data) => {
        console.log('selected onSelectTransType item is :--- ', data)

        let myPaymentTypes = [...selectedTransTypes]
        console.log('selected pay item is :--- ', myPaymentTypes)
        const isPaymentTypeExist = selectedTransTypes.some(el => el.id === data?.id);
        if (isPaymentTypeExist) {
            const arr = myPaymentTypes.filter((item) => item.id !== data?.id)
            myPaymentTypes = [...arr]
        } else {
            myPaymentTypes.push(data)
        }
        console.log('myPaymentTypes :--', myPaymentTypes)
        setSelectedTransTypes(myPaymentTypes)
    }

    const onSelectCryptoType = (data) => {
        console.log('selected onSelectTransType item is :--- ', data)

        let myPaymentTypes = [...selectedCryptoTypes]
        console.log('selected pay item is :--- ', myPaymentTypes)
        const isPaymentTypeExist = selectedCryptoTypes.some(el => el.id === data?.id);
        if (isPaymentTypeExist) {
            const arr = myPaymentTypes.filter((item) => item.id !== data?.id)
            myPaymentTypes = [...arr]
        } else {
            myPaymentTypes.push(data)
        }
        console.log('myPaymentTypes :--', myPaymentTypes)
        setSelectedCryptoTypes(myPaymentTypes)
    }

    const onSelectTransStatus = (data) => {
        console.log('selected onSelectTransStatus item is :--- ', data)

        let myPaymentTypes = [...selectedTransStatus]
        console.log('selected pay item is :--- ', myPaymentTypes)
        const isPaymentTypeExist = selectedTransStatus.some(el => el.id === data?.id);
        if (isPaymentTypeExist) {
            const arr = myPaymentTypes.filter((item) => item.id !== data?.id)
            myPaymentTypes = [...arr]
        } else {
            myPaymentTypes.push(data)
        }
        console.log('myPaymentTypes :--', myPaymentTypes)
        setSelectedTransStatus(myPaymentTypes)
    }

    const onSelectSubItems = (item) => {
console.log('onSelectSubItems onSelectSubItems ',item)
        switch (selectedMainFilter.value) {
            case 'transaction_Type':

                onSelectTransType(item)

                break
            case 'date_range':
                break
            case 'crypto':
                onSelectCryptoType(item)
                break
            case ('transaction_Status')://' : ''
            console.log('fdfsdfdsfdsfsdhfdshf shdfhsfdh dsjhfj dhs')
                onSelectTransStatus(item)
                break
            // case 'Trade Status':
            //     onSelectTransStatus(item)
            //     break
            default:
                break

        }

    }

    const FilterSubItem = ({ item }) => {

        let demoArr = []
        switch (selectedMainFilter.value) {
            case 'transaction_Type':
                demoArr = selectedTransTypes
                break
            case 'date_Range':
                break
            case 'crypto':
                demoArr = selectedCryptoTypes
                break
            case 'transaction_Status':
                demoArr = selectedTransStatus
                break
            default:
                break

        }
        // let isExist = (demoArr?.length) ? demoArr.find(val => val?.id == item?.id) : false
        let isExist = demoArr.find(val => val?.id == item?.id)

        return (
            <>
                <Pressable
                    android_ripple={{ color: Colors.selectedBg, borderless: false }}
                    onPress={() => onSelectSubItems(item)}
                >
                    <View style={{ flexDirection: 'row', gap: 0, alignItems: 'center' }}>
                        <Image
                            style={{ width: scale(22), height: scale(22) }}
                            source={isExist ? ImagePath.checkBlack : ImagePath.unCheck}
                            resizeMode='center'
                        />
                        <View style={{ justifyContent: 'center', marginLeft: 10, paddingVertical: 8 }}>
                            <Text style={{ ...TextStyles.regular, color: Colors.text_lightBlack }}>{item?.title}</Text>
                        </View>
                        {(item?.id !== demoArr?.length) &&
                            <View style={{ height: 1.2, backgroundColor: Colors.seprator }} />
                        }
                    </View>
                </Pressable>
            </>

        )
    }
    const onPressClearFilter = () => {
        switch (selectedMainFilter.value) {
            case 'transaction_Type':
                setSelectedTransTypes([])
                break
            case 'date_Range':
                setSelectedDateFilter({ from: '', to: '' })
                break
            case 'crypto':
                setSelectedCryptoTypes([])
                break
            case 'transaction_Status':
                setSelectedTransStatus([])
                break
            default:
                break

        }

    }
    const ClarFilterCompo = () => {
        let isHide = true
        switch (selectedMainFilter.value) {
            case 'transaction_Type':
                isHide = selectedTransTypes.length <= 0
                break
            case 'date_Range':
                isHide = (!selectedDateFilter.from || !selectedDateFilter.to)
                break
            case 'crypto':
                isHide = selectedCryptoTypes.length <= 0

                break
            case 'transaction_Status':
                isHide = selectedTransStatus.length <= 0

                break
            default:
                break

        }
        if (isHide) {
            return (
                <></>
            )
        }
        return (
            <Pressable
                android_ripple={{ color: Colors.selectedBg, borderless: false }}
                style={{ position: 'relative', alignSelf: 'flex-end', right: 0, top: moderateScale(0), marginRight: moderateScale(20) }}
                onPress={() => onPressClearFilter()}
            >
                <Components.GradientText
                    colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                    onPress={onPressClearFilter}
                    style={{
                        ...TextStyles.medium,
                        // fontFamily: AppFonts.regular,
                        fontSize: textScale(16),
                        color: Colors.text_Black,
                        // position:'absolute'
                    }}
                >
                    {'Clear'}
                </Components.GradientText>
            </Pressable>
        )
    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_White }}>
            <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />
            <Components.CustomPopUp
                onHardwareBackPress={closeAlert}
                onClickTouchOutside={closeAlert}
                scaleAnimationDialogAlert={showModal}
                HeaderTitle={Alerts.ALLERT}
                AlertMessageTitle={Alerts.Are_you_want_To_CLEAR_ALL_FILTERS}
                leftBtnText={Titles.Cancel}
                rightBtnText={Titles.ok}
                onPressLeftBtn={closeAlert}
                onPressRightBtn={onPressConfirm}
            />
            <View
                style={{ paddingTop: moderateScale(10), paddingBottom: moderateScale(10) }}
            >
                <Components.BackBtnHeader
                    containerStyle={{}}
                    leftBtnTitle=''
                    centerheaderTitle={lastData.screen == Constants.Transactions ? En.Transactions_Filters : lastData.screen == Constants.TradeHistory ? En.Trade_Filters : ''} />

                <ClarFilterCompo />
            </View>
            {/* <KeyboardAwareScrollView style={{flex:1}}> */}

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <View style={styles.container}>

                <View style={{ ...styles.innerContainer, flexGrow: 1 }}>
                    <View style={{ height: 1.2, backgroundColor: Colors.seprator }} />
                    <View style={{ flex: 1, flexDirection: 'row' }}>


                        <FlatList
                            style={{ flexGrow: 0.03, marginStart: moderateScale(10) }}
                            data={mainFiltersArr}
                            renderItem={FilterTypeItem}
                            ItemSeparatorComponent={<View style={{ height: 1.2, backgroundColor: Colors.seprator }} />}

                        />
                        <View style={{ height: '100%', width: 1.2, backgroundColor: Colors.seprator }} />

                        {(selectedMainFilter?.title === 'Date Range') ?

                            <View style={{ flex: 1, marginLeft: moderateScale(10) }}>
                                <View style={{ gap: 20 }}>
                                    <DatePickerTextInput
                                        headerText={'From'}
                                        containerStyle={{ flexGrow: 1, width: '80%', marginLeft: moderateScale(10) }}
                                        value={selectedDateFilter?.from}
                                        onFocus={() => showDatePicker('From')}

                                    />
                                    <DatePickerTextInput
                                        headerText={'To'}
                                        containerStyle={{ flexGrow: 1, width: '80%', marginLeft: moderateScale(10) }}
                                        value={selectedDateFilter?.to}
                                        onFocus={() => showDatePicker('To')}
                                    />
                                </View>

                            </View> :
                            <FlatList
                                style={{ flex: 1, marginLeft: moderateScale(10) }}
                                data={selectedMainFilter?.subArray}
                                renderItem={FilterSubItem}
                                ItemSeparatorComponent={<View style={{ height: 1.2, backgroundColor: Colors.seprator }} />}
                            />
                        }
                    </View>


                    <View style={{ ...styles.buttonContainer, marginTop: moderateScale(10), marginBottom: moderateScaleVertical(20) }}>
                        <TouchableHighlight
                            style={{ ...CommonStyles.button, ...styles.cancelButton }}
                            underlayColor={Colors.app_White}
                            onPress={() => onPressCancelBtn()}
                        >

                            <Components.GradientText
                                colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                                onPress={() => onPressCancelBtn()}
                                style={{ ...TextStyles.btnTitle, paddingVertical: moderateScaleVertical(8) }}
                            >
                                {Titles.Cancel}
                            </Components.GradientText>
                        </TouchableHighlight>


                        <Components.CustomButton title={Titles.Apply}
                            containerStyle={{ ...styles.customButton }}
                            gradiantStyle={{ paddingVertical: moderateScaleVertical(8) }}

                            onPress={() => onPressApplyFilter()} />
                    </View>


                </View>

            </View>
            {/* </KeyboardAwareScrollView> */}
            {loading && <Components.CustomLoader />}

        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: 150,
        marginTop: moderateScale(10)
    },
    innerContainer: {
        // marginHorizontal: 20,
        flex: 1,
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
        flex: 2,
        height: '100%',
        borderRadius: 5
        // marginTop: moderateScale(50),
    }, cancelButton: {
        borderColor: Colors.gradiantDwn,
        backgroundColor: Colors.app_Bg,
        borderWidth: 1.2,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        //  height: moderateScale(0),
        marginHorizontal: moderateScale(0),
        flex: 2,
        borderRadius: 5
    },
    buttonContainer: {
        gap: moderateScale(20),
        paddingHorizontal: moderateScale(20),
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: scale(45),
        //  marginTop: moderateScale(60),
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
export default TransactionFilter;
