import React from "react";
import {View, StyleSheet,Image } from "react-native";
import Colors from "../Colors/Colors";
import { ImageEnum, ImagePath } from "../Constants";
import { scale } from "../Styles/responsiveSize";

 const CustomLoader = ({containerStyle,imageStyle}) => {
    
    return (
        <View style={{...styles.container,...containerStyle}}>
        <Image source={ImagePath.loader_gif} style={{...styles.loaderImg,...imageStyle}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        backgroundColor:Colors.loader_Bg,
    },
    containerStyle:{
        backgroundColor:'red'
    },
    loaderImg:{
        height:scale(60), 
        width:scale(60),
        resizeMode:ImageEnum.contain
    }
})
export default CustomLoader;