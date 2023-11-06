//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { height, moderateScale, width } from '../Styles/responsiveSize';
import { TextStyles } from '../Styles/ComnStyle';
import Colors from '../Colors/Colors';
import En from '../Constants/En';
import { ImagePath } from '../Constants';
import { TouchableHighlight } from 'react-native-gesture-handler';
import NavigationService from '../Services/NavigationService';

// create a component
const HeaderComponent = ({ contanerStyle, headerText, subHeaderText = En.on_the_most_secure, headerStyle, subHeaderStyle, showLeftArrow = false, navigation }) => {
    function onPressBack() {
        NavigationService.goBack()
    }
    return (
        <View style={{ ...styles.container, ...contanerStyle }}>
            <View style={{ flexDirection: 'row', marginLeft: moderateScale(20) }}>
                {showLeftArrow &&


                    <TouchableHighlight
                        underlayColor={Colors.transparent}
                        onPress={onPressBack}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: 'center',
                                backgroundColor: Colors.transparent,
                                marginTop: moderateScale(5)
                            }}
                        >
                            <Image
                                source={ImagePath.arrowLeftGray} style={styles.arrowBack} />

                        </View>
                    </TouchableHighlight>
                }
                <View style={{ justifyContent: 'center', }}>


                    <Text style={{ ...TextStyles.bold, ...styles.header, ...headerStyle }}> {headerText}</Text>

                    {
                        (subHeaderText) &&
                        <Text style={{ ...TextStyles.medium, ...styles.subHeader, ...subHeaderStyle }}> {subHeaderText}</Text>
                    }
                </View>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: Colors.app_White,
    },
    header: {
        // marginLeft: moderateScale(20),
    },
    subHeader: {
        fontSize: 15,
        // marginLeft: moderateScale(20),
        marginTop: moderateScale(2),
        marginBottom: moderateScale(10)
    }, arrowBack: {
        height: moderateScale(25),
        width: moderateScale(25),
        resizeMode: 'contain',
        marginRight: moderateScale(0)
    }
});

//make this component available to the app
export default HeaderComponent;
