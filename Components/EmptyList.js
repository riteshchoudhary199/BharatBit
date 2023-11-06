//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from '../Styles/responsiveSize';
import { TextStyles } from '../Styles/ComnStyle';
import Colors from '../Colors/Colors';
import En from '../Constants/En';
import { Alerts } from '../Constants';

// create a component
const EmptyList = ({contanerStyle,headerText = Alerts.OPPS,subTitle = Alerts.NO_DATA_FOUND}) => {
    return (
        <View style={{...styles.container,...contanerStyle}}>
          <View style={{ justifyContent: 'center' ,alignItems:'center',gap:moderateScale(10)}}>
                    <Text style={{ ...TextStyles.bold, ...styles.header }}> {headerText}</Text>
                    <Text style={{ ...TextStyles.medium, ...styles.subHeader }}> {subTitle}</Text>
                </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: Colors.app_White,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:moderateScale(50)
    },
    header: {
    },
    subHeader: {
        fontSize: 15,
        // marginTop: moderateScale(2),
        marginBottom: moderateScale(20)
    },
});

//make this component available to the app
export default EmptyList;
