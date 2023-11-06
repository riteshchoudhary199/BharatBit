//import liraries
import React, { Children, Component } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { CommonStyles } from '../Styles/ComnStyle';
import ImagePath from '../Constants/ImagePath';
import { getStatusBarHeight } from 'react-native-status-bar-height';


// create a component
const ScreenWarpper = (
    { children,
        bgImage = ImagePath.bgImage, customStyle }
) => {
    return (
        <View style={{ ...CommonStyles.container, ...customStyle }}>
            <ImageBackground source={bgImage} resizeMode='contain' style={styles.image}>
                {children}
            </ImageBackground>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'center',
        // marginTop: getStatusBarHeight(true)
    }
});

//make this component available to the app
export default ScreenWarpper;
