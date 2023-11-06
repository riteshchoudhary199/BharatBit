//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, Alert } from 'react-native';
import { CommonStyles, TextStyles } from '../Styles/ComnStyle';
import ImagePath from '../Constants/ImagePath';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../Colors/Colors';

// create a component
const CustomButton = ({
    containerStyle, titleStyle, title, onPress,onDisablePress,
     isDigonal = false,
     isdisable = false,
     gradiantStyle,
    bgColors = [Colors.gradiantUp, Colors.gradiantDwn],
}) => {
    let colorArr = isDigonal ? bgColors.reverse() : bgColors

    return (
        <TouchableHighlight
            style={{ ...CommonStyles.button, ...containerStyle }}
            underlayColor={Colors.app_White}
            onPress={!isdisable? onPress:onDisablePress}
            
        >
            <LinearGradient
                colors={ !isdisable ?colorArr:[Colors.lightGreyTxt,Colors.lightGreyTxt]}
                style={{...styles.linearGradiant,...gradiantStyle}}
                 start={isDigonal ? { x: 0.85, y: 0 } : { x: 0, y: 0 }}
                 end={ isDigonal ? {x: 0, y: 1 } :{ x: 0, y: 0.95}}
            >
                <Text style={{ ...TextStyles.btnTitle, ...titleStyle }} >
                    {title}
                </Text>
            </LinearGradient>
        </TouchableHighlight>
    );
};

// define your styles
const styles = StyleSheet.create({
    linearGradiant: {
        height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center',
    },
});

//make this component available to the app
export default CustomButton;
