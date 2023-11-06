//import liraries
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, StatusBar, Alert, ActivityIndicator,Text } from "react-native";
import Colors from "../../../Colors/Colors";
import En from "../../../Constants/En";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, moderateScaleVertical, textScale, } from "../../../Styles/responsiveSize";
import * as Components from "../../../Components/indexx";
import Actions from "../../../Redux/Actions";
import { danger, showAlertMessage } from "../../../Utils/helperFunctions";
import { Alerts, Constants, ImagePath } from "../../../Constants";
import { RefreshControl } from "react-native-gesture-handler";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";

// import GetOfferComponent from '../../../Components/GetOfferComponent';
const Transactions = ({ navigation }) => {
  const [listItemsArr, setListItemsArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  const [pageLimit, setPageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageNo, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchText, setSearchText] = useState();
  const homeRedux = useSelector((state) => state?.homeReducer)
  // const allCoinsList = homeRedux?.allCoinsList
  const applyFilters = homeRedux?.transactionFilter

  console.log('applyFilters applyFilters TradeHistory : ----',applyFilters)

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

  useEffect(() => {
    setTimeout(() => {
      getTransactionList()
    }, 200);
}, [applyFilters]
)
  const onRefresh = React.useCallback(() => {
    console.log(" console.log : ---  onRefresh");
    setRefreshing(true)
    setTotalPages(1)
    setTimeout(() => {
      setCurrentPage(1);
      // getTransactionList()
    }, 200);
  }, []);

  const getTransactionList = () => {
    const load = (!refreshing && currentPageNo == 1)
    setLoading(load);
    setLoadMore(currentPageNo > 1)

    const tranSactionTypes = applyFilters?.tranSactionType.map((item) => item.value)
    const transactionStatus = applyFilters?.transactionStatus.map((item) => item.value)
    const cryptos = applyFilters?.cryptoType.map((item) => item.value)

    let query = `?from_date=${applyFilters?.dateRange?.from ?? ''}&to_date=${applyFilters?.dateRange?.to ?? ''}&transaction_type=${tranSactionTypes.toString() ?? ''}&transaction_status=${transactionStatus.toString() ?? ''}&transaction_crypto=${cryptos.toString() ?? ''}&pageNumber=${currentPageNo}&pageLimit=${10}`;
    console.log("all chat users list query", query);
    Actions.getMytransactionList(query)
      .then((res) => {
        const items = res?.data?.getResponse;
        console.log("all transaction list is", items);
        setTotalPages(res?.data?.totalPages ?? 2)
        if (currentPageNo == 1) {
          setListItemsArr(items);
        } else {
          setListItemsArr([...listItemsArr, ...items]);
        }
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


  const onpressFilter = () => {
    const data = { screen: Constants.Transactions }
    console.log("data onPressOptions is : ----", data)
    navigation.navigate(Constants.TransactionFilter, data)
  };
  const searchBar = () => {
    const onChangeSearchText = (value) => {
      setSearchText(value);
    };
    return (
      <>
        <Components.CustomTextInput
          // containerStyle={styles.textInput},
          containerStyle={styles.searchInput}
          innerContainerStyle={{
            backgroundColor: Colors.app_Bg,
            paddingVertical: moderateScale(15),
          }}
          value={searchText}
          textStyle={{ color: "red" }}
          onChangeText={(value) => onChangeSearchText(value)}
          placeholder={En.searchTrade}
          leftImage={ImagePath.search}
          keyboardType={"email-address"}
          rightImage={ImagePath.arrowDwn}
          isShowRightImage={false}
        />
      </>
    );
  };
  const TransactionListView = ({ item }) => {
    return (
      <View>
        <Components.TransactionComponent
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
          width: "100%",
          marginLeft: moderateScale(80),
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
                    <Text style={{marginTop:5}}></Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_Bg }}>
      <StatusBar backgroundColor={Colors.app_Bg} barStyle={"dark-content"} />

      {/* <KeyboardAwareScrollView style={{}}> */}
      <View style={{ ...styles.mainContainer }}>
        <View style={{ ...styles.innerContainer }}>
          {/* <Components.HeaderComponent
            headerText={En.chat}
            subHeaderText=""
            contanerStyle={{ backgroundColor: Colors.app_Bg }}
          /> */}
          <Components.BackBtnHeader
            navigation={navigation}
            isSowText={false}
            centerheaderTitle={`${En.Transactions}`}//lastScreenData?.name
            isRightBtn={true}
            rightBtnAction={onpressFilter}
            isBadgeEnable={applyFilters?.dateRange?.from || applyFilters?.dateRange?.to || applyFilters?.tranSactionType.length > 0 ||applyFilters?.transactionStatus.length > 0 || applyFilters?.cryptoType.length > 0}

          />
          {/* {searchBar()} */}
          <FlatList
            initialNumToRender={12}
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: moderateScale(10),
              backgroundColor: Colors.app_White,
            }}
            data={listItemsArr}
            ListFooterComponent={RenderFooterView}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={TransactionListView}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
             (!loading && !loadMore) && <Components.EmptyList subTitle={Alerts.EMPTY_TRASACTION_} />
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
    backgroundColor: Colors.app_Bg,
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
  }, orderDiscript: {
    color: Colors.text_green,
    fontSize: textScale(13),
    marginRight: 0,
    textAlign: 'right',
    marginTop: moderateScale(5)
},
});

//make this component available to the app
export default Transactions;
