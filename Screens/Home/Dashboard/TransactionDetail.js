//import liraries
import React, { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import Colors from "../../../Colors/Colors";
import * as Components from "../../../Components/indexx";
import { itemWidth, moderateScale, moderateScaleVertical, scale, textScale, width } from "../../../Styles/responsiveSize";
import { En, ImagePath } from "../../../Constants";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import Actions from "../../../Redux/Actions";
import { copyText, showAlertMessage } from "../../../Utils/helperFunctions";
import moment from "moment";
import { TextStyles } from "../../../Styles/ComnStyle";

// create a component
const TransactionDetail = ({ navigation, route }) => {
    const lastData = route?.params
    console.log("last screen transaction detail data is: ---- ", lastData)
    const [lastScrnData, setlastScrnData] = useState(lastData)
    const [trasDetail, setTransDetail] = useState(lastScrnData?.transactionDetail);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    useEffect(() => {
        getTransactionDetail()
    }, [lastScrnData]);
    const onPressButton = async (data) => { };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getTransactionDetail()
        }, 2000);
    }, []);

    const getTransactionDetail = () => {
        // setLoading(true);
        Actions.getAnTransactionDetail(lastScrnData?.transaction_id)
            .then((res) => {
                console.log("res while make getAnTransactionDetail is : --", res);
                const data = res?.data?.getResponse;
                console.log("data getAnTransactionDetail : --", data);
                setTransDetail(data);
                // setLoading(false);
                setRefreshing(false);
                // const msg = res?.message ? res.message : res.error
                // showAlertMessage(msg, success)
            })
            .catch((err) => {
                console.log("error from make transaction is : --", err);
                const msg = err?.message ? err.message : err.error;
                setRefreshing(false);
                // setLoading(false);
                showAlertMessage(msg);
            });
    };
    let transTime = moment(trasDetail?.createdAt).format('hh:mm a')

    const offerStatusText = () => {
        let status = trasDetail?.transaction_status
        return (
            <Text style={{
                ...TextStyles.medium, fontSize: textScale(15), color: status == 'pending' ?
                    Colors.text_Yellow : status == 'completed' ? Colors.text_green : Colors.text_red_dark
            }}>
                {`${(status || 'Nil').charAt(0).toUpperCase() + (status || 'Nil').slice(1)}`}
            </Text>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.app_Bg }}>
             <StatusBar backgroundColor={Colors.app_Bg} barStyle={'dark-content'} />
            <ScrollView
                bounces={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        tintColor={Colors.gradiantDwn}
                        title={En.loading}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.container}>
                    <Components.BackBtnHeader
                        navigation={navigation}
                        isSowText={false}
                        centerheaderTitle={`${En.Transaction_Detail}`}
                    />

                    <View style={styles.innerContaier}>
                        <View style={{ ...styles.detailBox, gap: 10 }}>


                            <Components.TransactionComponent
                                data={trasDetail}
                            />

                            <View
                                style={{ backgroundColor: Colors.seprator, height: 1.2 }}
                            />
                            <View style={{ gap: moderateScale(2), paddingVertical: moderateScaleVertical(10), paddingBottom: moderateScale(20), }}>
                                <View style={{ ...styles.spacerView, flexShrink: 1 }}>
                                    <Text style={{ ...TextStyles.bold, fontSize: 18 }}>{En.Transaction_Id}</Text>
                                    <Pressable
                                     style={{ flexDirection: 'row', alignItems: 'center' }}
                                     onLongPress={() => copyText(trasDetail?._id)}>
                                    <Image source={ImagePath.copy} style={{ height: scale(12), width: scale(15) }} resizeMode='contain' />
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                            style={{ ...TextStyles.medium, flexShrink: 1, fontSize: 14, textAlign: 'right', maxWidth: width / 2.5 }}>{trasDetail?._id}</Text>
                                    </Pressable>
                                </View>
                                <View style={styles.spacerView}>
                                    <Text style={{ ...TextStyles.bold, fontSize: 18 }}>{En.Time}</Text>
                                    <Text style={{ ...TextStyles.medium, fontSize: 14, textAlign: 'right', maxWidth: width / 1.8 }}>{transTime}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {loading && <Components.CustomLoader />}
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Colors.app_Bg
    },
    innerContaier: {
        flex: 1,
        paddingVertical: moderateScale(25),
    },
    detailBox: {
        flexDirection: 'column',
        backgroundColor: Colors.app_White,
        borderColor: Colors.border_textfld_dark,
    },
    spacerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(12)
    }

});

//make this component available to the app
export default TransactionDetail;
