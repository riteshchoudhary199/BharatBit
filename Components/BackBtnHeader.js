
//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { height, moderateScale, scale } from '../Styles/responsiveSize';
import Colors from '../Colors/Colors';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { ImagePath, Titles } from '../Constants';
import { TextStyles } from '../Styles/ComnStyle';
import NavigationService from '../Services/NavigationService';

// create a component
const BackBtnHeader = ({ navigation, containerStyle, isSowText = true,
     isShowBackImage = true, centerheaderTitle = '',onPressBackBtn=()=>{},leftBtnTitle = Titles.Back,
isRightBtn = false,rightImage = ImagePath.filterGradiant,rightBtnAction,isBadgeEnable = false}) => {
    function onPressBack() {
        NavigationService.goBack()
        onPressBackBtn()
    }
    return (
        <View style={{ ...containerStyle, backgroundColor: Colors.transparent }}>
            <View
                style={{ flexDirection: "row",alignItems:'center' }}>


                {/* MARK : -- back Button */}
                <View
                    style={{
                        flexDirection: "row",
                        marginLeft: moderateScale(10),
                        alignItems: 'center',
                        marginTop: moderateScale(5),
                        marginBottom: moderateScale(5),
                    }}
                >
                    <TouchableHighlight
                        underlayColor={Colors.transparent}
                        onPress={onPressBack}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: 'center',
                                backgroundColor: Colors.transparent
                            }}
                        >
                            {isShowBackImage &&
                                <Image source={ImagePath.arrowLeftBlack} style={styles.arrowBack} />
                            }
                            {isSowText &&
                                <Text style={{ ...TextStyles.medium, ...styles.userName }}> {leftBtnTitle}</Text>
                            }
                        </View>
                    </TouchableHighlight>

                </View>
                {/* MARK : -- back Button */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ ...TextStyles.bold, ...styles.headerTitle,paddingEnd: moderateScale(isRightBtn ? 0:50) }}> {centerheaderTitle}</Text>
                </View>

                {isRightBtn &&

                <Pressable
                style={{marginRight:moderateScale(8),paddingVertical:5}}
                android_ripple={{color:Colors.selectedBg,borderless:true}}
                        underlayColor={Colors.transparent}
                        onPress={rightBtnAction}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: 'center',
                                backgroundColor: Colors.transparent
                            }}
                        >
                            {isShowBackImage &&
                                <Image source={rightImage} style={styles.arrowBack} />
                            }
                        </View>
                        { isBadgeEnable &&
                        <View style = {{position:'absolute',height:6,width:6,top:0,right:0,backgroundColor:'red',borderRadius:5,}}/>
                        }
                        
                    </Pressable>
}
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    userName: {
        color: Colors.darkGrayTxt,
        marginRight: moderateScale(5)
    }, arrowBack: {
        height: scale(20),
        width: scale(25),
        resizeMode: 'contain',
        marginRight: moderateScale(5),
    },
    headerTitle: {
        alignSelf: 'center',
        color: Colors.text_Black,
        justifyContent: 'center',
        // paddingEnd: moderateScale(50)

    }
});

//make this component available to the app
export default BackBtnHeader;
