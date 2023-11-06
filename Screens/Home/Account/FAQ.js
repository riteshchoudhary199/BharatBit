//import liraries
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, StatusBar, Alert, ActivityIndicator, Text, Image, TouchableOpacity } from "react-native";
import Colors from "../../../Colors/Colors";
import En from "../../../Constants/En";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, moderateScaleVertical, scale, } from "../../../Styles/responsiveSize";
import * as Components from "../../../Components/indexx";
import Actions from "../../../Redux/Actions";
import { danger, showAlertMessage } from "../../../Utils/helperFunctions";
import { Alerts, Constants, ImagePath, Titles } from "../../../Constants";
import { RefreshControl } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { TextStyles } from "../../../Styles/ComnStyle";

// import GetOfferComponent from '../../../Components/GetOfferComponent';
const FAQ = ({ navigation }) => {
    const [listItemsArr, setListItemsArr] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPageNo, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = React.useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState();

    useEffect(() => {
        getTransactionList();
        console.log(" console.log : --- useEffect");
    }, [currentPageNo]);

    const onReachEnd = () => {
        console.log("transaction: --- onReachEnd", currentPageNo);
        if (currentPageNo < totalPages) {
            setCurrentPage(currentPageNo + 1);
        }
    };

    const onRefresh = React.useCallback(() => {
        console.log("console.log : ---  onRefresh");
        setRefreshing(true)

        // setTotalPages(1)
        setTimeout(() => {
                getTransactionList()
        }, 200);
    }, []);

    const getTransactionList = () => {
        const load = (!refreshing && currentPageNo == 1)
        setLoading(load);
        setLoadMore(currentPageNo > 1)

        Actions.getFaqList().then((res) => {
            const items = res?.data;
            console.log("all transaction list is", items);
            setTotalPages(res?.data?.totalPages ?? 2)
            // if (currentPageNo == 1) {
            setListItemsArr(items);
            // } else {
            //   setListItemsArr([...listItemsArr, ...items]);
            // }
            let msg = res?.message;
            console.log("all transaction msg is", msg);
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

                showAlertMessage((message = error?.error), (alertType = danger));
            });
    };


    const TransactionListView = ({ item }) => {
        return (
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>

                <View
                    style={{ ...styles.discriptionContainer,backgroundColor:selectedQuestion?._id == item?._id?Colors.app_Bg:Colors.app_White ,overflow: 'hidden', gap: moderateScaleVertical(15) }}
                >

                    <TouchableOpacity
                        onPress={() => selectedQuestion?._id == item?._id ? setSelectedQuestion(undefined) : setSelectedQuestion(item)}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', gap: moderateScale(20) }}>
                        <Text style={{ ...TextStyles.medium,fontSize:20, flexShrink: 1, }}>{item?.question}</Text>
                        <Image
                            source={selectedQuestion?._id == item?._id ? ImagePath.circleMinus : ImagePath.circlePlus}
                            style={{ height: scale(25), width: scale(25) }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    {selectedQuestion?._id == item?._id &&
                        <Text style={TextStyles.small}>{item?.answer}</Text>
                    }
                </View>
            </View>
        );


    };

    const ItemSeparatorView = () => {
        return (
            // FlatList Item Separator
            <View
                style={{
                    height: 0,
                    //   width: "100%",
                    //   marginLeft: moderateScale(70),
                    backgroundColor: Colors.seprator, //'#C8C8C8'
                }}
            />
        );
    };
    const RenderFooterView = () => {
        return (
            <View
                style={{
                    width: "100%", alignItems: 'center', justifyContent: 'center'
                }}
            >
                {(!loadMore && !loading && currentPageNo >= totalPages) &&
                    <Text>No more data found</Text>
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
            <StatusBar backgroundColor={Colors.app_White} barStyle={"dark-content"} />

            {/* <KeyboardAwareScrollView style={{}}> */}
            <View style={{ ...styles.mainContainer }}>
                <View style={{ ...styles.innerContainer }}>
                    {/* <Components.HeaderComponent
            headerText={En.chat}
            subHeaderText=""
            contanerStyle={{ backgroundColor: Colors.app_Bg }}
          /> */}
            <Components.BackBtnHeader
                        leftBtnTitle={Titles.F_A_Q}
                        navigation={navigation}
                    />
                   
                    {/* {searchBar()} */}
                    <FlatList
                        initialNumToRender={12}
                        showsVerticalScrollIndicator={false}
                        style={{
                            marginTop: moderateScale(10),
                            backgroundColor: Colors.app,
                        }}
                        data={listItemsArr}
                        // ListFooterComponent={RenderFooterView}
                        ItemSeparatorComponent={ItemSeparatorView}
                        renderItem={TransactionListView}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={
                            (!loading && !loadMore) && <Components.EmptyList subTitle={Alerts.NO_DATA_FOUND} />
                        }
                        onEndReached={onReachEnd}
                        onEndReachedThreshold={0.5}
                        contentInset={{ bottom: 20 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                tintColor={Colors.gradiantDwn}
                                title={En.loading}
                                onRefresh={onRefresh}
                            />
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
    mainContainer: {
        flex: 1,
        marginTop: 0,
        backgroundColor: Colors.app_White,
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 0,
    },
    header: {},
    subHeader: {
        fontSize: 15,
        marginTop: 2,
        marginBottom: 20,
    },
    searchInput: {
        // marginBottom: moderateScale(5),
        marginHorizontal: moderateScale(20),
        paddingVertical: moderateScale(5),
    },
    reuseContainer: {
        // marginVertical: 30,
    }, discriptionContainer: {
        backgroundColor: Colors.bg_textfld_dark, borderRadius: 10,
        borderColor: Colors.border_textfld_dark, borderWidth: 1.4,
        paddingHorizontal: moderateScale(10), paddingVertical: moderateScaleVertical(10)
    },
});

//make this component available to the app
export default FAQ;
