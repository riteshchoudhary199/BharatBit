//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
// create a component
const CustomStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, {backgroundColor}]}>
        <SafeAreaView>
            <StatusBar translucent backgroundColor={backgroundColor} {...props}
                barStyle='dark-content' />
        </SafeAreaView>
    </View>
);

export default CustomStatusBar;
const styles = StyleSheet.create({
    statusBarStyle:{
        height:STATUSBAR_HEIGHT
    }
})


