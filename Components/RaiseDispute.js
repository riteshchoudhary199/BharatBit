import React, { Component, useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View, TextInput, Pressable, Keyboard, useAnimatedValue } from 'react-native';
import DropDownField from './DropDownField';
import Dialog, { DialogContent, ScaleAnimation, } from 'react-native-popup-dialog';
import CustomButton from '../Components/CustomButton';
import { moderateScale, moderateScaleVertical, scale, textScale } from '../Styles/responsiveSize';
import Colors from '../Colors/Colors';
import { En, ImagePath, Titles } from '../Constants';
import { CommonStyles, TextStyles } from '../Styles/ComnStyle';
import * as Components from "./indexx"
import { documentPicker } from '../Utils/DocumentPicker';
import { danger, showAlertMessage } from '../Utils/helperFunctions';
import Actions from '../Redux/Actions';
// import { documentPicker } from '../Utils/DocumentPicker';


function RaiseDispute({
    popUpContainerStyle,
    onPressCancelBtn = () => { },
    onPressSendBtn = () => { },
    onClickTouchOutside = () => { },
    resetPopUp,
    loader,
    btnStyle,
    offerData,
    disputeTypes,
    scaleAnimationDialogAlert = false,
    onHardwareBackPress = () => { },

}) {
    const [discription, setDiscription] = useState('')
    const [disputeType, setDisputeType] = useState('')
    const [selectedFileData, setSelectedFileData] = useState(undefined)
    const [fileName, setFileName] = useState('')
    const [loading, setLoading] = useState(false)
    const [disputeTypeArr,setDisputeTypeArr] = useState(disputeTypes)
    // const disputeTypeArr = [{ title: 'Fund not transfer', _id: 'Low to High' },
    // { title: 'Amount too much', _id: 'High to Low' },
    // { title: 'Others', _id: 'Others' }]


    useEffect(
        useCallback(() => {
            setLoading(loader)

        }, [loader])

    )


    useEffect(()=>{
     clearData()
    },[resetPopUp])

    const onSelectDropDown = (item) => {
        console.log("selected item is : --- ", item)
        setDisputeType(item)
    }

    const clearData = () => {
        setSelectedFileData(undefined)
        setFileName('')
        setDisputeType('')
        setDiscription('')
        // setDiscription('')

    }
    // console.log("setSelectedFileData item is : --- ", selectedFileData)
    const onPressSelectDocument = async () => {
        if (selectedFileData) {
            setSelectedFileData(undefined)
            setFileName('')
        } else {
            const document = await documentPicker()
            console.log("document document : --", document)
            const fileData = document?.fileData
            if (fileData && document.error === undefined) {
                setSelectedFileData(document?.fileData)
                setFileName(fileData?.name)
            } else {
                // setFileName('')
                // setSelectedFileData(undefined)
            }
        }

    }



    return (
        <View>
            <Dialog
                width={0.93}
                visible={scaleAnimationDialogAlert}
                dialogAnimation={new ScaleAnimation()}
                onClickTouchOutside={onClickTouchOutside}
                onHardwareBackPress={onHardwareBackPress}>
                <DialogContent style={{ ...styles.conatiner, ...popUpContainerStyle }}>
                <Pressable style={{ justifyContent: 'center', width: '100%' }} onPress={() => Keyboard.dismiss()}>
                    {/* MARK : ---  Crosss dilog buttton  */}
                    <View style={{ alignItems: 'flex-end', }}>
                        <TouchableHighlight
                            underlayColor={Colors.app_White}
                            onPress={onPressCancelBtn}
                        >
                            <Image source={ImagePath.cancelSqr}
                                resizeMode='contain'
                                style={{ height: scale(35), width: scale(35) }}
                            />
                        </TouchableHighlight>
                    </View>
                    <Components.DropDownField
                        data={disputeTypeArr}
                        defaultValue={disputeType}
                        placeholderText={En.Dispute_Type}
                        labelHeaderText={En.Whats_Problm_can_we_help}
                        headerTextStyle={{ ...styles.subtitleStyle, marginBottom: moderateScale(5), }}
                        containerStyle={{
                            marginBottom: moderateScale(10)
                        }}
                        onSelecton={onSelectDropDown}
                        isSearch={false}
                        dropdownStyle={{ ...styles.textInputInnerContainer, }}
                    />

                    <Text
                        style={{ ...TextStyles.medium, ...styles.subtitleStyle, marginBottom: moderateScale(5) }}>
                        {En.Description}
                    </Text>


                    <View
                        style={{ ...styles.discriptionContainer, marginBottom: moderateScale(15) }}
                    >
                        <TextInput
                            style={{ ...CommonStyles.textInput, flex: 1, }}
                            textAlignVertical='top'
                            multiline
                            placeholder={En.enterMessage}
                            placeholderTextColor={Colors.darkGrayTxt}
                            value={discription}
                            onChangeText={(val) => setDiscription(val)}
                        />
                    </View>


                    <Text
                        style={{ ...TextStyles.medium, ...styles.subtitleStyle, marginBottom: moderateScale(5) }}>
                        {En.Attatch_Media_}
                    </Text>
                    <View
                        style={styles.attachContainer}
                    >

                        <Image source={ImagePath.attacthment}
                            resizeMode='contain'
                            style={{ height: scale(25), width: scale(25), }}
                        />

                        <TouchableHighlight
                            onPress={onPressSelectDocument}
                            style={{
                                paddingHorizontal: moderateScale(5),
                                paddingVertical: moderateScale(6),
                                backgroundColor: '#4B5563',
                                borderRadius: 4, justifyContent: 'center', alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{ ...TextStyles.medium, color: Colors.text_White }}
                            >{selectedFileData !== undefined ? Titles.Remove_file : Titles.Choose_File}</Text>
                        </TouchableHighlight>
                        <View style={{ marginLeft: moderateScale(3), maxWidth: '50%' }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{ ...TextStyles.medium, fontSize: textScale(15), color: Colors.darkGrayTxt, }}
                            >{fileName ? fileName : En.No_File_Chossen}</Text>
                            {
                                selectedFileData !== undefined &&
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={{ ...TextStyles.medium, fontSize: textScale(15), color: Colors.darkGrayTxt, }}
                                >{fileName?.split('.').pop().toUpperCase()}</Text>
                            }
                        </View>
                    </View>
                    <CustomButton title={Titles.Send}
                        // titleStyle={styles.btnTxt}
                        containerStyle={{ ...styles.btn, ...btnStyle }}
                        onPress={
                            () => onPressSendBtn({ disputeType: disputeType, discription: discription, fileData: selectedFileData })
                            // {
                            // onPressSendBtn,
                            // sendDispute
                            // }
                        } />
                    {loading && <Components.CustomLoader />}
                    </Pressable>
                </DialogContent>
            </Dialog>

        </View>
    );

}
const styles = StyleSheet.create({
    conatiner: {
        // justifyContent: 'center',
        paddingVertical: moderateScale(20),
        backgroundColor: Colors.app_White,
        // alignItems: 'center',
        // marginHorizontal: 10

    },
    titleStyle: {
        marginTop: moderateScaleVertical(20)
    },
    subtitleStyle: {
        color: 'rgba(101, 101, 101, 0.5)',
        // marginTop: moderateScaleVertical(15),
        // marginBottom: moderateScaleVertical(20),
        fontSize: moderateScale(15)
    },
    btn: {
        marginVertical: moderateScaleVertical(5)
        // width:'100%'
        // flex: 1
    },
    btnTxt: {
        fontSize: moderateScale(14)
    },
    discriptionContainer: {
        backgroundColor: Colors.app_White, borderRadius: 10,
        borderColor: Colors.border_textfld_dark, borderWidth: 1.2,
        height: moderateScale(150), paddingHorizontal: moderateScale(0), paddingVertical: moderateScaleVertical(0)
    },
    attachContainer: {
        gap: moderateScale(5),
        backgroundColor: Colors.app_White, borderRadius: 10,
        borderColor: Colors.border_textfld_dark, borderWidth: 1.2,
        alignItems: 'center',
        // justifyContent:'space-evenly',
        height: moderateScale(50), paddingHorizontal: moderateScale(10), paddingVertical: moderateScaleVertical(0),
        marginBottom: moderateScale(25), flexDirection: 'row'
    },
    dropDownContainer: {
        marginBottom: moderateScale(10)
    }, textInputInnerContainer: {
        backgroundColor: Colors.app_White,
        borderWidth: 1.2
    },
});

export default RaiseDispute;
