//import liraries
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, StatusBar, Alert, ActivityIndicator, Text } from "react-native";
import Colors from "../../../Colors/Colors";
import En from "../../../Constants/En";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, moderateScaleVertical, } from "../../../Styles/responsiveSize";
import { CommonStyles } from '../../../Styles/ComnStyle'
import * as Components from "../../../Components/indexx";
import Actions from "../../../Redux/Actions";
import { danger, showAlertMessage } from "../../../Utils/helperFunctions";
import { Alerts, Constants, ImagePath, Titles } from "../../../Constants";
import { RefreshControl, TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { TextStyles } from "../../../Styles/ComnStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// import GetOfferComponent from '../../../Components/GetOfferComponent';
const HowItWorks = ({ navigation }) => {
    const [apiData, setApiData] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPageNo, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = React.useState(false);


    //   const isFocused = useIsFocused();

    useEffect(() => {
        getTransactionList();
        console.log(" console.log : --- useEffect");
    }, []);

    const onRefresh = React.useCallback(() => {
        console.log("console.log : ---  onRefresh");
        setRefreshing(true)

        setTimeout(() => {
            getTransactionList()
        }, 200);
    }, []);

    const getTransactionList = () => {
        const load = (!refreshing)
        setLoading(load);
        const query = `?type=howItWorks`
        Actions.howItWorks(query).then((res) => {
            const items = res?.data;
            console.log("all transaction list is", items);
            setApiData(items);
            let msg = res?.message;
            console.log("all transaction msg is", msg);
            setLoading(false);
            setRefreshing(false)
            // showAlertMessage(message = (res?.message) ? (res?.message) : (res?.error), alertType = (res?.message) ? success : warning)
        })
            .catch((error) => {
                console.log("catch error in  chat users is :---- ", error);
                setLoading(false);
                setRefreshing(false)
                showAlertMessage((message = error?.error), (alertType = danger));
            });
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_Bg }}>
            <StatusBar backgroundColor={Colors.app_Bg} barStyle={"dark-content"} />

            {/* <KeyboardAwareScrollView style={{}}> */}
            <View style={{ ...styles.mainContainer }}>
                <View style={{ ...styles.innerContainer }}>
                    {/* <Components.BackBtnHeader
                        navigation={navigation}
                        isSowText={false}
                        centerheaderTitle={`${Titles.How_it_Works}`}//lastScreenData?.name
                    /> */}
                    <Components.BackBtnHeader
                        leftBtnTitle={Titles.How_it_Works}
                        navigation={navigation}
                    />

                    <KeyboardAwareScrollView
                        scrollEnabled={false}
                        style={{ paddingHorizontal: 20, paddingTop: 25 }}
                    >
                        <View
                            style={styles.discriptionContainer}
                        >
                            <TextInput
                                style={{ ...CommonStyles.textInput, ...TextStyles.regular, flex: 1, marginBottom: moderateScaleVertical(10), alignContent: 'flex-start', }}
                                textAlignVertical='top'
                                multiline
                                editable={false}
                                // placeholder={En.enterDiscription}
                                placeholderTextColor={Colors.placeholder}
                                value={apiData?.content}
                            />
                        </View>


                    </KeyboardAwareScrollView>

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
    }, discriptionContainer: {
        backgroundColor: Colors.bg_textfld_dark, borderRadius: 10,
        // borderColor: Colors.gradiantUp, borderWidth: 1.2,
        // height: moderateScale(150),
        paddingHorizontal: moderateScale(10), paddingVertical: moderateScaleVertical(10)
    },
});

//make this component available to the app
export default HowItWorks;
