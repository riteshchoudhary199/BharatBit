import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Dialog, {
    DialogContent,
    ScaleAnimation,
} from 'react-native-popup-dialog';

import CustomButton from '../Components/CustomButton';
import { moderateScale, moderateScaleVertical } from '../Styles/responsiveSize';
import Colors from '../Colors/Colors';
import { En, Titles } from '../Constants';
import { TextStyles } from '../Styles/ComnStyle';

function CustomPopUp({
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
    useEffect(() => {
        setShowModal(scaleAnimationDialogAlert)
    }, [scaleAnimationDialogAlert])
    return (
        <View>
            <Dialog
                width={0.9}
                visible={showModel}
                dialogAnimation={new ScaleAnimation()}
                onClickTouchOutside={onClickTouchOutside}
                onHardwareBackPress={onHardwareBackPress}>
                <DialogContent style={[styles.conatiner, { ...popUpContainerStyle }]}>
                    <Text
                        style={[TextStyles.btnTitle, styles.titleStyle, { color: HeadTitleColor, textAlign: 'center' }]}>
                        {HeaderTitle}
                    </Text>

                    {renderSubtitle ?

                        <View style={ {marginTop: moderateScaleVertical(15),
                            marginBottom: moderateScaleVertical(20),alignItems:'center'}}>{renderSubtitle}</View> :
                        <Text
                            style={[TextStyles.small, styles.subtitleStyle, { color: MessageColor, textAlign: 'center' }]}>
                            {AlertMessageTitle}
                        </Text>

                    }
                    {/* <Text
                        style={[TextStyles.small, styles.subtitleStyle, { color: MessageColor, textAlign: 'center' }]}>
                        {AlertMessageTitle}
                    </Text> */}
                    <View style={{ flexDirection: 'row', gap: moderateScale(20), paddingHorizontal: moderateScale(0) }}>
                        <CustomButton title={leftBtnText}
                            titleStyle={styles.btnTxt}
                            containerStyle={{ ...styles.btn, ...btnStyle }}
                            bgColors={[Colors.darkGrayTxt, Colors.darkGrayTxt]}
                            onPress={onPressLeftBtn} />
                        <CustomButton title={rightBtnText}
                            titleStyle={styles.btnTxt}
                            containerStyle={{ ...styles.btn, ...btnStyle }}
                            onPress={onPressRightBtn} />
                    </View>
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
        marginHorizontal: 10

    },
    titleStyle: {
        marginTop: moderateScaleVertical(20)
    },
    subtitleStyle: {
        marginTop: moderateScaleVertical(15),
        marginBottom: moderateScaleVertical(20),
        fontSize: moderateScale(14)
    },
    btn: {
        // width:'100%'
        flex: 1
    },
    btnTxt: {
        fontSize: moderateScale(14)
    }
});

export default CustomPopUp;
