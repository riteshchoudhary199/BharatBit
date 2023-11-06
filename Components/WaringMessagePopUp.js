import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from 'react-native';

import Dialog, {
    DialogContent,
    ScaleAnimation,
} from 'react-native-popup-dialog';

import CustomButton from './CustomButton';
import { moderateScale, moderateScaleVertical, textScale } from '../Styles/responsiveSize';
import Colors from '../Colors/Colors';
import { Alerts, AppFonts, En, Titles } from '../Constants';
import { TextStyles,CommonStyles} from '../Styles/ComnStyle';
import CustomTextInput from './CustomTextInput';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as Components from "./indexx"

function WaringMessagePopUp({
    HeaderTitle,
    HeadTitleColor = Colors.blackishGray,
    MessageColor,
    AlertMessageTitle,
    popUpContainerStyle,
    leftBtnText = Titles.Cancel,
    rightBtnText = Titles.ok,
    onPressLeftBtn,
    onPressRightBtn,
    onClickTouchOutside,
    btnStyle,
    scaleAnimationDialogAlert = false,
    onHardwareBackPress = () => { },
    renderSubtitle
}) {
    const [showModel, setShowModal] = useState(false)
    const [textVal, setTextVal] = useState('')

    useEffect(() => {
        setShowModal(scaleAnimationDialogAlert)
    }, [scaleAnimationDialogAlert])
    return (
        <View style={{}}>
            <Dialog

                width={0.9}
                visible={showModel}
                dialogAnimation={new ScaleAnimation()}
                onClickTouchOutside={onClickTouchOutside}
                onHardwareBackPress={onHardwareBackPress}>

                <DialogContent
                    style={[styles.conatiner, { ...popUpContainerStyle }]}>
                    <Pressable style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }} onPress={() => Keyboard.dismiss()}>
                        <Text
                            style={[TextStyles.btnTitle, styles.titleStyle, { color: HeadTitleColor, textAlign: 'center' }]}>
                            {HeaderTitle}
                        </Text>

                        {/* <Text style={{ ...TextStyles.bold, fontSize: 14 }}>{`\n'Delete Account'`} </Text> */}
                        <Text
                            style={[TextStyles.small, styles.subtitleStyle, { color: MessageColor, textAlign: 'center' }]}>
                            {AlertMessageTitle}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: moderateScale(20), paddingHorizontal: moderateScale(0) }}>
                            <TouchableHighlight
                                style={{ ...CommonStyles.button, ...styles.btn, ...styles.deleteButton,...btnStyle }}
                                underlayColor={Colors.app_White}
                                onPress={onPressLeftBtn}
                            >
                                <Components.GradientText
                                    colors={[Colors.gradiantUp, Colors.gradiantDwn]}
                                    onPress={onPressLeftBtn}
                                    style={{ ...TextStyles.btnTitle,...styles.btnTxt }}
                                >
                                    {leftBtnText}
                                    
                                </Components.GradientText>
                            </TouchableHighlight>

                            <CustomButton title={rightBtnText}
                                titleStyle={styles.btnTxt}
                                // isdisable={textVal !== 'Delete Account'}
                                containerStyle={{ ...styles.btn, ...btnStyle }}
                                onPress={() => {
                                    setTextVal('')
                                    onPressRightBtn()
                                }}
                               
                            />
                            {/* <CustomButton title={rightBtnText}
                                titleStyle={styles.btnTxt}
                                // isdisable={textVal !== 'Delete Account'}
                                bgColors={[Colors.app_White, Colors.app_White]}
                                containerStyle={{ ...styles.btn, ...btnStyle }}
                                onPress={() => {
                                    setTextVal('')
                                    onPressRightBtn()
                                }} /> */}
                        </View>
                    </Pressable>
                </DialogContent>
            </Dialog>
        </View>
    );

}
const styles = StyleSheet.create({
    conatiner: {
        justifyContent: 'center',
        backgroundColor: Colors.app_White,
        alignItems: 'center',
        marginHorizontal: 10,
        // marginBottom:120
    },
    titleStyle: {
        marginTop: moderateScaleVertical(20)
    },
    subtitleStyle: {
        marginTop: moderateScaleVertical(5),
        marginBottom: moderateScaleVertical(20),
        fontSize: moderateScale(14)
    },
    btn: {
        // width:'100%'
        height:moderateScale(50),
        flex: 1
    },
    btnTxt: {
        fontSize: moderateScale(14)
    },
    textInput: {
        height: 40, paddingHorizontal: 5, borderColor: Colors.border_textfld_dark,
        borderWidth: 1.2, borderRadius: 10, width: '80%', marginBottom: moderateScaleVertical(15), alignContent: 'center', textAlign: 'center',
        fontSize: textScale(16),
        fontFamily: AppFonts.regular,
        textAlignVertical: 'center'
    }, deleteButton: {
        borderColor: Colors.gradiantDwn,
        backgroundColor: Colors.app_White,
        borderWidth: 1.2,
        alignItems: 'center',
        justifyContent: 'center', height: moderateScale(50),
        marginHorizontal: moderateScale(15)
    }
});

export default WaringMessagePopUp;
