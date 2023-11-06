//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, FlatList, Image, StatusBar, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../Colors/Colors';
import En from '../../Constants/En';
import { TextStyles } from '../../Styles/ComnStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, moderateScaleVertical, scale, textScale } from '../../Styles/responsiveSize';
import Titles from '../../Constants/Titles';
import * as Components from "../../Components/indexx"
import { danger, showAlertMessage } from '../../Utils/helperFunctions';
import Actions from '../../Redux/Actions';
import { Alerts, Constants, ImagePath } from '../../Constants';
import { RefreshControl } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import socketServices, { userOnline } from '../../Services/scoketService';
import NavigationService from '../../Services/NavigationService';
;
export const HeaderView = ({isBadge}) => {
    function onPressOptions() {
        const data = { screen: Constants.deals }
        console.log("data onPressOptions is : ----", data)
        NavigationService.navigate(Constants.OfferFilters, data)
    }
    function createoffer() {
        NavigationService.navigate(Constants.sells)
    }

    const containerCreateOffer = () => {

        return (
            <LinearGradient
                colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                style={styles.linearGradiant}
            >
                <View style={styles.createOfferInnerContainer}>
                    <Text style={{ ...TextStyles.bold, ...styles.titleWellCome_to_sell }} >
                        {En.want_to_sell_your_cripto}
                    </Text>
                    <Text style={{ ...TextStyles.small, ...styles.titleCreateOfferToSell }} >
                        {En.crete_an_offer_to_sell_your_crypto_easily}
                    </Text>
                    <TouchableHighlight style={{ ...styles.createOfferBtn }}>
                        <Components.GradientText
                            onPress={() => createoffer()}
                            colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                            //   onPress={() => onPressLogin()}
                            style={{ ...TextStyles.medium, ...styles.titleCreateOffer }} >
                            {Titles.createOfffer}
                        </Components.GradientText>

                    </TouchableHighlight>
                </View>
            </LinearGradient>
        )

    }

    return (
        <View>
            {containerCreateOffer()}
            <View
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    marginVertical: moderateScale(15), paddingHorizontal: moderateScale(5)
                }}
            >
                <Text style={{ ...TextStyles.bold, ...styles.header }}> {"Open Offers"}</Text>
                {/* <View style = {{paddingEnd:moderateScale(5),alignItems:'center',justifyContent:'center'}}> */}
              
                <TouchableHighlight
                    underlayColor={Colors.app_White}
                    onPress={() => onPressOptions()}
                style={{paddingHorizontal:5}}
                >
                    <>
                      { isBadge &&
                        <View style = {{position:'absolute',height:6,width:6,top:0,right:0,backgroundColor:'red',borderRadius:5,}}/>
                        }
                    <Image source={ImagePath.filterBtack}
                        resizeMode='center'
                        style={{ height: scale(18), width: scale(18), marginVertical: 8 }}
                    />
                    </>
                </TouchableHighlight>
                {/* </View> */}

            </View>

            <View>
            </View>


        </View>
    );
};

const Deals = ({ navigation, route }) => {
    const nextScreenData = route?.params
    const [listItemsArr, setListItemsArr] = useState([]);
    const [loading, setLoading] = useState(false)
    const [showEmptyView, setShowEmptyView] = useState(false)

    const [loadMore, setLoadMore] = useState(false);
    const [totalPages, setTotalPages] = useState(1)
    const [refreshing, setRefreshing] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true)
    const userDetails = useSelector((state) => state?.auth?.userLoginStatus)
    const homeRedux = useSelector((state) => state?.homeReducer)
    const applyFilters = homeRedux?.offerFilter
    const isFocused = useIsFocused();
    useEffect(() => {
        Actions.getCoinsLivePrices()
    }, [isFocused])
    useFocusEffect(
        React.useCallback(() => {
            // userOnline()
            if (userDetails) {
                socketServices.socket.emit('online', { 'userId': userDetails?._id ?? '' }, function (res) {
                    socketServices.on('streamline-event', onListenNewCoinPrice)
                    console.log('connected====', res)
                    // {"data": {"Bitcoin": {"inrLivePrice": 2236151, "usdLivePrice": 26841}, "Ethereum": {"inrLivePrice": 136469, "usdLivePrice": 1638.08}, "USDT": {"inrLivePrice": 83.37, "usdLivePrice": 1.001}}}
                })
                console.log('socketServices emit to online', userDetails?._id)
            }
            Actions.getCoinsLivePrices()
            setTimeout(async () => {
                fetchUserData()
            }, 600);
        }, [])
    );

    const onListenNewCoinPrice = (res) => {
        // console.log('onListenNewCoinPrice : ---', res)
        const data = res?.data
        if (data) {
            Actions.updateLivePrices(data)
        }
        // Alert.alert(JSON.stringify(res))

    }
    useEffect(() => {
        console.log('nextScreenData is getAllOffers getAllOffers')
        getAllOffers()
    }, [pageNo])



    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
            getAllOffers()
            Actions.getAllCoins()
            Actions.getAdminDetails()
        }, 200);
    }, [applyFilters, isFocused]
    )


    const onReachEnd = () => {
        console.log("current page is onReachEnd : ---", pageNo)
        if (pageNo < totalPages) {
            setPageNo(pageNo + 1)
        }
        // setPageNo(pageNo + 1)
        // getAllOffers(page)
    }

    // const onEndReachedDelayed = debounce(onReachEnd, 1000, {
    //     leading: true,
    //     trailing: false,
    // });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setPageNo(1)
        setTimeout(() => {

            (async () => {
                const users = await Actions.getCoinsLivePrices()
            })();
            (async () => {
                const users = await getAllOffers()
            })();

            (async () => {
                const users = await Actions.getAdminDetails()
            })();
        }, 2000);
    }, [applyFilters]);

    // const getAdminDetails = async () => {
    //     setLoading(true);
    //    await Actions.getAdminDetails()
    //         .then((res) => {
    //             const data = res?.data
    //             console.log("getAdminDetails is", data);
    //             // setAdminWalletAddress(data)
    //             let msg = res?.message;
    //             console.log("all transaction msg is", msg);
    //             setLoading(false);
    //             // showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? success : warning)
    //         })
    //         .catch((error) => {
    //             console.log("catch error getAdminDetails is :---- ", error);
    //             setLoading(false);
    //             showAlertMessage((message = error?.error), (alertType = danger));
    //         });
    // };


    const getAllOffers = async () => {
        const filterKey = applyFilters?.filterData
        const payMethods = filterKey?.paymentMethods.length ? filterKey?.paymentMethods.map((item) => item?._id):''
        const showMyOffer = false ? '' : `userId=${userDetails?._id}&`
        let query = `?${showMyOffer}crypto=${filterKey?.crypto ?? ''}&price_sort=${filterKey?.price_sort ?? ''}&country=${filterKey?.country ?? ''}&PaymentMethod=${payMethods.toString() ?? ''}&pageNumber=${pageNo}&pageLimit=${5}`

        let params = { "userId": userDetails._id }
        console.log("all getAllOffers query are  :----- ", query);
        const load = ((pageNo == 1 && !refreshing) ? true : false)
        setLoading(load)
        setLoadMore(pageNo > 1)
        setShowEmptyView(false)
        await Actions.getAllOffers(query)
            .then(async (res) => {
                // console.log("all getAllOffers query are  :----- ", query);

                // let newArr = [...listItemsArr, ...arr]
                console.log("all getAllOffers list  :----- ", res);
                setTotalPages(res?.data?.totalPages ?? 2)
                if (pageNo == 1) {
                    setListItemsArr(res?.data?.getResponse)
                } else {
                    setListItemsArr([...listItemsArr, ...res?.data?.getResponse])
                }
                setLoading(false);
                setLoadMore(false)
                setRefreshing(false);
                setShowEmptyView(true)

                // showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? success : warning)
            })
            .catch((error) => {
                console.log("catch getAllOffersis :---- ", error);
                setLoading(false);
                setRefreshing(false);
                setLoadMore(false)
                setShowEmptyView(true)


                showAlertMessage(message = error?.error, alertType = danger)
            });
    }
    const fetchUserData = async () => {
        setLoading(true);
        await Actions.userProfileAction()
            .then((res) => {
                console.log("user account Api profile response is >>>> ", res, ">>>>>")
                //  showAlertMessage(res.message,alertType = success)
                setLoading(false);
                // getAllOffers()
            })
            .catch((error) => {
                console.log("user account profil error is >>>>", error, "<<<<<");
                showAlertMessage(error?.error, alertType = danger)
                setLoading(false);
            });
    }
    const OfferDeatilComonent = ({ item }) => {
        return (
            // FlatList Item
            <View>
                <Components.GetOfferComponent
                    offerDetail={item}
                    navigation={navigation}
                    containerStyle={styles.reuseContainer} onPressBuyBtn={() => actionBuy()} />
            </View>
        );
    };
    const ItemSeparatorView = () => {
        return (
            // FlatList Item Separator
            <View
                style={{
                    height: 18,
                    width: '100%',
                    //   backgroundColor: '#C8C8C8'
                }}
            />
        );
    };
    const RenderFooterView = () => {
        return (
            <View
                style={{
                    width: "100%", alignItems: 'center', justifyContent: 'center',
                }}
            >
                {(!loadMore && !loading && pageNo >= totalPages && listItemsArr?.length > 0) &&
                    <Text style={{ marginTop: 20 }}></Text>
                }
                {(loadMore) &&
                    <ActivityIndicator size={'large'} color={Colors.gradiantDwn}
                        style={styles.indicator}
                    />
                }
            </View>
        );
    };
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_White }}>
            <StatusBar backgroundColor={Colors.app_White} barStyle={'dark-content'} />

            {/* <KeyboardAwareScrollView style={{}}> */}
            <View
                style={{ ...styles.mainContainer }}
            >
                <View
                    style={{ ...styles.innerContainer }}
                >
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                        style={{ marginTop: moderateScale(10) }}
                        data={listItemsArr}
                        ListHeaderComponent={<HeaderView isBadge={ applyFilters?.filterData?.paymentMethods?.length || applyFilters?.filterData?.crypto || applyFilters?.filterData?.country}/>}
                        ListFooterComponent={RenderFooterView}//{<View style={{ height: moderateScaleVertical(80), }} />}
                        ItemSeparatorComponent={ItemSeparatorView}
                        renderItem={OfferDeatilComonent}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={(!loading && !loadMore && showEmptyView) && <Components.EmptyList subTitle={Alerts.EMPTY_DEAL} />}
                        // onMomentumScrollEnd={onEndReachedDelayed}
                        // bounces={false}
                        // onEndReached={onEndReachedDelayed}
                        onEndReached={onReachEnd}
                        onEndReachedThreshold={0.5}

                        automaticallyAdjustContentInsets={false}
                        refreshControl={
                            <RefreshControl displayName={'Loading'} style={{ color: Colors.gradiantDwn }} tintColor={Colors.gradiantDwn} title={En.loading} refreshing={refreshing} onRefresh={onRefresh} />
                        }

                    />
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
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20
    },
    header: {
    }
    ,

    mainContainer: {
        flex: 1,
        marginTop: 0,
        backgroundColor: Colors.app_White
    },
    innerContainer: {
        marginHorizontal: 15,
        flex: 1,
    },

    linearGradiant: {
        borderRadius: 5,
        marginHorizontal: moderateScale(5)
    },
    createOfferInnerContainer: {
        marginLeft: moderateScale(12),
        alignItems: 'flex-start'
    },

    titleWellCome_to_sell: {
        marginTop: moderateScale(15),
        color: Colors.text_White,

    },
    titleCreateOfferToSell: {
        marginTop: moderateScale(5),
        color: Colors.text_White,
    },
    createOfferBtn: {
        // alignSelf:'flex-start',
        backgroundColor: Colors.app_White,
        borderRadius: 5,
        marginBottom: moderateScale(20),
        marginTop: moderateScale(25),
    },
    titleCreateOffer: {
        fontSize: textScale(12),
        marginVertical: moderateScale(10),
        marginHorizontal: moderateScale(30)
    },
    dropDownComponenet: {
        marginTop: moderateScale(20),
        marginHorizontal: moderateScale(5)
    },
    reuseContainer: {
        marginHorizontal: moderateScale(5)
        // marginVertical: 30,
    }

});

//make this component available to the app
export default Deals;
