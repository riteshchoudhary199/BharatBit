//import liraries
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator, Alert, Pressable, TouchableOpacity } from 'react-native';
import Colors from '../../../Colors/Colors';
import En from '../../../Constants/En';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, moderateScaleVertical, textScale } from '../../../Styles/responsiveSize';
import * as Components from "../../../Components/indexx"
import Actions from '../../../Redux/Actions';
import { danger, showAlertMessage, success, warning } from '../../../Utils/helperFunctions';
import { Alerts, Constants, ImagePath } from '../../../Constants';
import { RefreshControl } from 'react-native-gesture-handler';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { CommonStyles, TextStyles } from '../../../Styles/ComnStyle';

import socketServices from '../../../Services/scoketService';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';


// import GetOfferComponent from '../../../Components/GetOfferComponent';
const Trades = ({ navigation }) => {
    const [listItemsArr, setListItemsArr] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loadMore, setLoadMore] = useState(false);
    const [currentPageNo, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [refreshing, setRefreshing] = React.useState(false);
    const [searchText, setSearchText] = useState()
    const [activeTab, setActiveTab] = useState(0)

    const isFocused = useIsFocused();
    const currentNotification = useSelector((state) => state?.notification?.currentNotification)

    
    useEffect(() => {
        if (currentNotification?.data?.controller == 'chats'){
            getChatList(false)
        }
    }, [currentNotification]);
  
    useEffect(() => {
        Actions.getNotificationsCount()
        Actions.getAllCoins()
        getChatList()
        console.log(" console.log : --- useEffect : --- ", currentPageNo)
    }, [currentPageNo,activeTab,isFocused,]
    );

    const onReachEnd = async () => {
        console.log("onReachEnd page no is : ---", currentPageNo)
        console.log("totalPages pages no is : ---", totalPages)
        if (currentPageNo < totalPages) {
            setCurrentPage(currentPageNo + 1)
        }

    }

    const onRefresh = React.useCallback(() => {
        console.log(" console.log : ---  onRefresh")
        setTimeout(() => {
            setRefreshing(true)
            setCurrentPage(1)
            getChatList()
        }, 2000);
    }, []);


    const getChatList = (loader = true) => {
        // setLoading(true);
        const filter = activeTab==0?'active':'inactive'//,successful 
        setLoading(currentPageNo == 1 && !refreshing && loader);
        setLoadMore(currentPageNo > 1 && loader)
        let query = `?chatStatus=${filter}&pageNumber=${currentPageNo}&pageLimit=${10}`
        console.log("all chat users list query", query);
        Actions.getChatList(query)
            .then((res) => {
                const items = res?.data?.items
                setTotalPages(res?.data?.totalPages ?? 5)
                if (currentPageNo == 1) {
                    setListItemsArr(items)
                } else {
                    setListItemsArr([...listItemsArr, ...items])
                }
                let msg = res?.message
                console.log("all chats list msg is", msg);
                setLoading(false);
                setLoadMore(false)
                setRefreshing(false)
                // showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? success : warning)
            })
            .catch((error) => {
                console.log("catch error in  chat users is :---- ", error);
                setLoading(false);
                setLoadMore(false)
                setRefreshing(false)
                showAlertMessage(message = error?.error, alertType = danger)
            });
    }
    const actionBuy = () => {
        navigation.navigate(Constants.chat)
    }
    const searchBar = () => {

        const onChangeSearchText = (value) => {
            setSearchText(value)
        }
        return (
            <>
                <Components.CustomTextInput
                    // containerStyle={styles.textInput},
                    containerStyle={styles.searchInput}
                    innerContainerStyle={{ backgroundColor: Colors.app_Bg, paddingVertical: moderateScale(15) }}
                    value={searchText}
                    textStyle={{ color: 'red' }}
                    onChangeText={value => onChangeSearchText(value)}
                    placeholder={En.searchTrade}
                    leftImage={ImagePath.search}
                    keyboardType={'email-address'}
                    rightImage={ImagePath.arrowDwn}
                    isShowRightImage={false}
                />
            </>
        )

    }
    const ChatListView = ({ item }) => {
        return (
            <View
            >
                <Components.UserList
                    data={item}
                    navigation={navigation}
                    containerStyle={styles.reuseContainer}
                />
            </View>
        );
    };
    const ItemSeparatorView = () => {
        return (
            // FlatList Item Separator
            <View
                style={{
                    height: 1.2,
                    width: '100%',
                    marginLeft: moderateScale(80),
                    backgroundColor: Colors.seprator //'#C8C8C8'

                }}
            />
        );
    };
    // const onEndReachedDelayed = debounce(onReachEnd, 1000, {
    //     leading: true,
    //     trailing: false,
    // });
    const RenderFooterView = () => {
        return (
            <View
                style={{
                    width: "100%", alignItems: 'center', justifyContent: 'center'
                }}
            >
                {(!loadMore && !loading && currentPageNo >= totalPages && listItemsArr?.length > 0) &&
                    <Text style={{marginTop:5}} ></Text>
                }
                {(loadMore) &&
                    <ActivityIndicator size={'large'} color={Colors.gradiantDwn}
                        style={styles.indicator}
                    />
                }
            </View>
        );
    };


    const CustomTabButton = ({ title, style, index }) => {
        const active = index == activeTab
        return (
            <Pressable
                style={{ ...style }}
                // underlayColor={Colors.app_White}
                onPress={() => {
                    setCurrentPage(1)
                    setActiveTab(index)
                }}

            >
                <LinearGradient
                    colors={active ? [Colors.gradiantUp, Colors.gradiantDwn] : ['rgba(218, 218, 218, 1)', 'rgba(218, 218, 218, 1)']}
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                    start={false ? { x: 0.85, y: 0 } : { x: 0, y: 0 }}
                    end={false ? { x: 0, y: 1 } : { x: 0, y: 0.95 }}
                >
                    <Text style={{
                        ...TextStyles.btnTitle,
                        fontSize: textScale(16),
                        paddingVertical: moderateScaleVertical(14),
                        color: active ? Colors.text_White : 'rgba(118, 118, 118, 1)'
                    }} >
                        {title}
                    </Text>
                </LinearGradient>
            </Pressable>
        )
    }
    const TopTabbars = () => {

        return (

            <View

                style={{ paddingHorizontal: 30 }}
            >

                <View style={{ flexDirection: 'row', borderRadius: 100, overflow: 'hidden' }}>

                    <CustomTabButton

                        index={0}
                        style={{ flex: 2 }}
                        title={'Active Chats'}

                    />
                    <CustomTabButton
                        index={1}


                        style={{ flex: 2 }}
                        title={'Inactive Chats'}
                    />
                </View>
            </View>
        )
    }

    return (
        <>
            <StatusBar backgroundColor={Colors.app_Bg} barStyle={'dark-content'} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_Bg }}>
                {/* <KeyboardAwareScrollView style={{}}> */}
                <View
                    style={{ ...styles.mainContainer, }}
                >

                    <View
                        style={{ ...styles.innerContainer }}
                    >
                        <View style={{ backgroundColor: Colors.app_Bg, paddingVertical: moderateScale(12), gap: moderateScale(12) }}>
                            <Components.HeaderComponent headerText={En.chat} subHeaderText='' contanerStyle={{ backgroundColor: Colors.app_Bg }} />
                            <TopTabbars />
                        </View>

                        {/* {searchBar()} */}
                        <FlatList
                            initialNumToRender={10}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom:moderateScale(0)}}
                            style={{ paddingTop: moderateScale(10), backgroundColor: Colors.app_White, marginBottom: moderateScale(0) }}
                            data={listItemsArr}
                            // ListFooterComponent={<View style={{ height: moderateScaleVertical(52) }} />}
                            ItemSeparatorComponent={ItemSeparatorView}
                            ListFooterComponent={RenderFooterView}

                            renderItem={ChatListView}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={(!loading && !loadMore) && <Components.EmptyList subTitle={Alerts.EMPTY_CHATLIST} />}
                            // onEndReached={onEndReachedDelayed}
                            onEndReached={onReachEnd}
                            // onEndReachedThreshold={0.5}
                            contentInset={{ bottom: 60 }}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} tintColor={Colors.gradiantDwn} title={En.loading} onRefresh={onRefresh} />
                            }
                        />
                    </View>
                </View>
                {/* </KeyboardAwareScrollView> */}
                {loading && <Components.CustomLoader />}

            </SafeAreaView>
        </>

    );
};

// define your styles
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        marginTop: 0,
        backgroundColor: Colors.app_Bg
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 0,
    },
    header: {
    },
    subHeader: {
        fontSize: 15,
        marginTop: 2,
        marginBottom: 20
    },
    searchInput: {
        // marginBottom: moderateScale(5),
        marginHorizontal: moderateScale(20),
        paddingVertical: moderateScale(5)
    },
    reuseContainer: {
        // marginVertical: 30,
    }


});

//make this component available to the app
export default Trades;
