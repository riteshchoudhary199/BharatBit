//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, Touchable, Pressable } from 'react-native';
import { CommonStyles, TextStyles } from '../Styles/ComnStyle';
import Colors from '../Colors/Colors';
import { Constants, En, ImagePath } from '../Constants';
import * as Components from "./indexx"
import { itemWidth, moderateScale, width } from '../Styles/responsiveSize';
import { formatNumberToFixed } from '../Utils/helperFunctions';

// create a component
const CryptoDetailComponent = ({ containerStyle, data, navigation, name = "", showArrow ,}) => {
    // console.log("data from CryptoDetailComponent component is : -- ", data)


    const onPressCoin = () => {
        // navigtn.navigate(Constants.coinDetail)
        console.log("data from CryptoDetailComponent component is : -- ", data)
        // return
        if (data?.name != 'Transactions'){
        navigation.navigate(Constants.coinDetail,data)
        }else{
            navigation.navigate(Constants.Transactions,data)
        }

    }
    const bgColor = data.name == 'Bitcoin' ? 'rgba(247, 147, 26, 0.15)' : data.name == 'Ethereum' ? 'rgba(98, 126, 234, 0.15)' : data.name == 'USDT' ? "rgba(5, 163, 120, 0.15)" : data.name == 'Transactions'?'rgba(8, 78, 204, 0.06)':''

    return (
<View
 style={{ ...styles.container,...containerStyle,backgroundColor:bgColor}}
//  style={{overflow:'hidden'}}

>
        <Pressable
        // style={{ ...CommonStyles.shadow, ...styles.container,...containerStyle,backgroundColor:bgColor}}
                // style={styles.btnEdit}
                // android_ripple={{color:Colors.selectedBg,borderless:true}}
                underlayColor={Colors.selectedBg}
                suppressHighlighting={false}
            onPress={() => onPressCoin()}
            >    
        <View style={{ }}>
                    <Components.LoaderImage
                        imageUrl={data?.logo}
                        containerStyle={{alignItems:'flex-start',justifyContent:'flex-start'}}
                        style={{ ...CommonStyles.smallLogoImgStyle, ...styles.coinLogo }}
                    />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom:moderateScale(3),
                        // justifyContent:'space-evenly',
                        paddingLeft:0,
                        paddingRight:0
                        // marginTop:50
                    }}>
                        <Text style={{ ...TextStyles.medium, ...styles.detail,}}>
                            {`${name} ${data?.name || ''}`}
                        </Text>
                        {/* {showArrow &&
                            <Image source={ImagePath.arrow_right_lighBrown} style={styles.arrowRight} />
                        } */}
                    </View>
                    <Text style={{ ...TextStyles.extraBold, ...styles.price }}>{`${data?.balance ? formatNumberToFixed(data?.balance).toString() : '0'}`}</Text>
                    {/* </View> */}
        
        </View>

         </Pressable>
         </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        width: 180,
        paddingVertical: moderateScale(20),
        paddingHorizontal:moderateScale(12),
        paddingRight: 0,
        elevation:0,
        borderRadius:8
        
        // gap: moderateScale(12)
    },
    detail: {
        color: Colors.darkGrayTxt,
    },
    price: {
        marginTop:moderateScale(3)
        // padding: 0,
    },
    arrowRight: {
        height: moderateScale(20), width: moderateScale(20),
        resizeMode: 'contain',
        marginLeft: moderateScale(5),
    },
    coinLogo: {
        marginBottom:moderateScale(8)
    }

});

//make this component available to the app
export default CryptoDetailComponent;
