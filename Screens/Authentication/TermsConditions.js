


//import liraries
import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import Colors from "../../Colors/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, textScale, } from "../../Styles/responsiveSize";
import * as Components from "../../Components/indexx";
import { WebView } from 'react-native-webview'; 
import Actions from "../../Redux/Actions";

// import GetOfferComponent from '../../../Components/GetOfferComponent';
export const MyWebComponent = ({url,loading=()=>{}}) => {
  if (!url){
    return<></>
  }
  return <WebView
   source={{ uri: url }} style={{ flex: 1 }}
   onLoadEnd={ ()=> loading(false)}
   onLoadStart={()=> loading(false)}
   onLoadProgress={()=> loading(false)}
   stopLoading={()=> loading(false)}
  
  />;
}
const TermsConditions = ({ navigation,route }) => {
  const lastScreenData = route?.params
  const [listItemsArr, setListItemsArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  const [pageLimit, setPageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageNo, setCurrentPage] = useState(1);
  const [currentLoadUrl, setCurrentLoadUrl] = useState('');
  const [apiData, setApiData] = useState({});


  useEffect(() => {

    console.log(" console.log : --- useEffect");
    const title = lastScreenData?.title
    if (title === 'Terms and Conditions' ){
      setCurrentLoadUrl('https://bharatbit.zip2box.com/term&condition_m')
    }else{
      setCurrentLoadUrl('https://bharatbit.zip2box.com/privacypolicy_m')
    }


  }, [lastScreenData]);
  const getHtmData = () => {
    setLoading(true);
    const type = title === 'Terms and Conditions' ?'termAndConditions':'privacyPolicy'

    const query = `?type=${type}`
    Actions.howItWorks(query).then((res) => {
        const items = res?.data;
        console.log("all getHtmData list is", items);
        setApiData(items);
        let msg = res?.message;
        console.log("all getHtmData msg is", msg);
        setLoading(false);
        // setRefreshing(false)
        // showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? success : warning)
    })
        .catch((error) => {
            console.log("catch error in  getHtmData users is :---- ", error);
            setLoading(false);
            // setRefreshing(false)
            showAlertMessage((message = error?.error), (alertType = danger));
        });
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
            centerheaderTitle={`${lastScreenData?.title ?? ''}`}//lastScreenData?.name
            // isRightBtn={true}
            // rightBtnAction={onpressFilter}
            // isBadgeEnable={applyFilters?.dateRange?.from || applyFilters?.dateRange?.to || applyFilters?.tranSactionType.length > 0 ||applyFilters?.transactionStatus.length > 0 || applyFilters?.cryptoType.length > 0}

          />
          <MyWebComponent
          loading={(val)=>(setLoading(val))}
           url={currentLoadUrl}/>
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
export default TermsConditions;
