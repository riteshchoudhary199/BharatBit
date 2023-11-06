
import React from "react";
import { View, Text,Image } from "react-native";
import { ImagePath } from "../Constants/index";
import { StyleSheet } from "react-native";
import { CommonStyles, TextStyles } from "../Styles/ComnStyle";
import { moderateScale, moderateScaleVertical } from "../Styles/responsiveSize";
// import { Image } from "react-native-svg";

function AuthCommonView({ prop, customStyle
}) {
    return (
        <View style={{ ...styles.container, ...customStyle,gap:10 }}>
            <Image source={ImagePath.logo} style={[CommonStyles.logoImgStyle,{ marginBottom: moderateScale(5)}]} />
            <View style={{alignItems:'center',gap:moderateScale(3)}}>
            <Text style={{ ...TextStyles.bold ,...styles.header}}> {prop.title}</Text>
            <Text style={{ ...TextStyles.small, textAlign: 'center', }}> {prop.subtitle}</Text>
            </View>
        </View>
    )
}
// define your styles
const styles = StyleSheet.create({
    container: {
        marginBottom: moderateScale(25),
        marginTop: moderateScale(30),
        alignItems: 'center',
        paddingHorizontal:moderateScaleVertical(20)
    },
    header:{
        marginBottom:moderateScale(2)
    }

});


export default AuthCommonView