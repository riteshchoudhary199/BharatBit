//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableHighlight, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, moderateScaleVertical, width } from '../../../Styles/responsiveSize';
import { TextStyles } from '../../../Styles/ComnStyle';
import ImagePath from '../../../Constants/ImagePath';
import Colors from '../../../Colors/Colors';
import * as Components from "../../../Components/indexx"
import Actions from '../../../Redux/Actions';
import { danger, showAlertMessage, success, warning } from '../../../Utils/helperFunctions';
import { Alerts, Constants, En } from '../../../Constants';
import { RefreshControl } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

const Dashboard = ({ navigation }) => {
    const [myOffersListItems, setMyOffers] = useState([]);
    const [coinsArray, setCoinsArray] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loadMore, setloadMore] = useState(false)

    const [pageLimit, setPageLimit] = useState(1)
    const [currentPageNo, setCurrentPage] = useState(1)
    const [refreshing, setRefreshing] = React.useState(false);
    const insets = useSafeAreaInsets();
    const onReachEnd = () => {
        console.log("onReachEnd")
        // setCurrentPage(currentPageNo + 1)
        getAllOffers()

    }
    const isFocused = useIsFocused();
    useEffect(() => {
        Actions.getNotificationsCount()
        Actions.userProfileAction()
    }, [isFocused]);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        (async () => {
            const users = await Actions.getCoinsLivePrices()
        })();
        setTimeout(() => {
            getAllOffers()
        }, 2000);
    }, []);


    const getAllOffers = () => {

        let query = `?pageNumber=${currentPageNo}&pageLimit=${pageLimit}`
        // Actions.getMyTransactions(query)
        // setLoading(true);
        setloadMore(currentPageNo > 1)
        Actions.userProfileAction()
            .then((res) => {
                let query = `?pageNumber=${currentPageNo}&pageLimit=${10}`
                console.log("all transaction list query params are  =---", query);
                console.log("all coinDetails list res =---", res?.data?.coinDetails,);
                setMyOffers(res?.data?.offers)
                setCoinsArray(res?.data?.coinDetails)
                let msg = res?.message
                console.log("all transaction msg is", msg);
                setloadMore(false)
                setLoading(false);
                setRefreshing(false);
                //showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? success : warning)
            })
            .catch((error) => {
                console.log("catch error in login is :---- ", error);
                setloadMore(false)
                setLoading(false);
                setRefreshing(false);
                showAlertMessage(message = error?.error, alertType = danger)
            });
    }


    useEffect(() => {
        setLoading(true);
        getAllOffers()

    }, []);
    function onPressOptions() {
        Alert.alert(onPressOptions.name)
    }
    function actionBuy() {
        Alert.alert(actionBuy.name)
    }
    const headerView = () => {
        let coinQtyArr = coinsArray.map((item) => item.balance)
        const sumOfAllCoins = coinQtyArr.reduce((total, currentValue) => {
            return total + currentValue;
        }, 0)
        let transaction = {
            "name": "Transactions",
            "logo": Image.resolveAssetSource(ImagePath.ellipse).uri,
            "balance": sumOfAllCoins,
        }
        const onPressCoinDetail = (data) => {
            // navigtn.navigate(Constants.coinDetail)
            navigation.navigate(Constants.coinDetail,)
        }
        return (
            <View>
                <View style={{ justifyContent: 'center', gap: moderateScale(20), marginBottom: moderateScale(15), marginHorizontal: moderateScale(20) }}>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', }}>
                        {coinsArray.map((data) => {
                            const bgColor = data.name == 'Bitcoin' ? 'rgba(247, 147, 26, 0.15)' : data.name == 'Ethereum' ? 'rgba(98, 126, 234, 0.15)' : data.name == 'USDT' ? "rgba(5, 163, 120, 0.15)" : ''

                            return (
                                <Components.CryptoDetailComponent
                                    navigation={navigation}
                                    data={data}
                                    name={En.Total}
                                    containerStyle={{ ...styles.cryptoDetail }}
                                // onPressCoin={()=> onPressCoinDetail()}
                                // showArrow={data.id == 4} 
                                />
                            )
                        })}


                        <Components.CryptoDetailComponent
                            navigation={navigation}
                            data={transaction}
                            containerStyle={{ ...styles.cryptoDetail, backgroundColor: 'rgba(8, 78, 204, 0.05)' }}
                            showArrow={true}
                        // showArrow={data.id == 4} 
                        />
                    </View >
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}
                    >
                        <Text style={{ ...TextStyles.bold, ...styles.header }}>{En.My_Offers}</Text>
                        {/* <TouchableHighlight
                            underlayColor={Colors.app_White}
                            onPress={() => onPressOptions()}
                        >
                            <Image source={ImagePath.options} />
                        </TouchableHighlight> */}
                    </View>
                </View >
            </View>

        );

    };

    const myOffersComponent = ({ item }) => {
        return (
            // FlatList Item
            <View>
                <Components.MyOfferList
                    data={item}
                    navigation={navigation}
                    containerStyle={styles.reuseContainer}
                />
            </View>
        );
    };
    const footerComponent = () => {
        return (
            // FlatList Item Separator
            <View
                style={{
                    // backgroundColor: Colors.seprator
                }}
            >
                {loadMore &&
                    <ActivityIndicator color={Colors.gradiantDwn}
                        size="large"
                        style={{ marginVertical: 20 }}

                    />
                }

            </View>
        );
    };
    return (
        <View style={{...styles.container,}}>
            <StatusBar backgroundColor={Colors.app_Bg} barStyle={'dark-content'} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_Bg }}>
                <View style={{...styles.container,}}>
                <Components.HeaderComponent contanerStyle={{ backgroundColor: Colors.app_Bg ,}}
                            subHeaderStyle={{ marginBottom: moderateScale(0) }}
                            headerText={En.Wallet} />
                    <View
                        style={{ ...styles.innerContainer }}
                    >
                       
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: moderateScale(10), }}
                            data={myOffersListItems}
                            // data={dummyArray}
                            ListHeaderComponent={headerView}
                            ListFooterComponent={footerComponent}
                            ItemSeparatorComponent={<View
                                style={{
                                    height: 1,
                                    width: '100%',
                                    backgroundColor: Colors.seprator
                                }} />}
                            renderItem={myOffersComponent}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={!loading && <Components.EmptyList subTitle={Alerts.EMPTY_TRASACTION_} />}
                            onEndReached={onReachEnd}
                            onEndReachedThreshold={0.5}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} tintColor={Colors.gradiantDwn} title={En.loading} onRefresh={onRefresh} />
                            }
                        />
                    </View>
                </View>
                {loading && <Components.CustomLoader />}
            </SafeAreaView>
        </View>

    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.app_Bg,
      
    }, innerContainer: {
        flex: 1,
        marginHorizontal: moderateScale(0),
        // marginBottom: moderateScale(60)
    },
    cryptoDetail: {
        width: ((width / 2) - moderateScale(30)),
        marginBottom: moderateScale(10),
    },
    header: {
    },
    subHeader: {
        fontSize: 15,
        marginTop: moderateScale(2),
        marginBottom: moderateScale(20)
    },
    reuseContainer: {
        backgroundColor: Colors.app_White
    }
});

//make this component available to the app
export default Dashboard;
