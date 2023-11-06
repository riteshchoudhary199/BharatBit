//import liraries
import React, { Children, Component } from 'react';
import { View, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { CommonStyles } from '../Styles/ComnStyle';
import ImagePath from '../Constants/ImagePath';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../Colors/Colors';
import * as Components from "./indexx"


// create a component
const AppWrapper = (
    { children,topSafeAreaStyle,bottomSafeAreaStyle,loading }) => {
    return (
        <>
         {/* <View style={[styles.statusBar,{backgroundColor:'red'}]}>
            <StatusBar backgroundColor={'red'} {...props} />
        </View> */}
        
        <StatusBar backgroundColor={Colors.authfooterColor} />
        <SafeAreaView style={{ flex:0,backgroundColor: Colors.authfooterColor,...topSafeAreaStyle }} 
      edges={["left", "right", "bottom"]}
        
        />
      <SafeAreaView style={{ flex:1, backgroundColor: Colors.authfooterColor,...bottomSafeAreaStyle }}
      edges={["left", "right", "bottom"]}
      >
           {/* <View style={{ flex:1, backgroundColor:'black' }}> */}
           {children}
            {/* </View> */}
        </SafeAreaView>
        {loading && <Components.CustomLoader/>}
         </>
    )
};
const BAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
    statusBar: {
        height: BAR_HEIGHT
    },
});

            //make this component available to the app
export default AppWrapper;
