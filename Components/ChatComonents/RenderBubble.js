import { Bubble } from 'react-native-gifted-chat';
import { AppFonts, Colors, ImagePath ,En, ImageEnum,} from '../../Constants';

import React from 'react';
import { Clipboard, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Alerts, En, ImageEnum, ImagePath, Titles } from '../../Constants';
// import { moderateScale, textScale, width } from '../../Styles/responsiveSize';
import { CommonStyles, TextStyles } from '../../Styles/ComnStyle';
import { moderateScale, width,height,textScale } from '../../Styles/responsiveSize';

import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';

 const RenderBubble = ({ props, myProfileDetail, offerDetail, offerUserDetail, setSelectedMessage = () => { }, setFileVisible = () => { }, renderMessageImage, renderCustomView }) => {
    const { currentMessage, position } = props;
    const handleBubbleLongPress = async (message) => {
        const messageText = message.text;
        Clipboard.setString(messageText);
    };
    // console.log("currentMessage renderBubble : ---  ",currentMessage,'position is : --',position)
    if (currentMessage.isDefault && currentMessage.isDefault == true) {
        return (
            <>
                {(offerDetail, offerUserDetail) &&
                    <View
                        style={{ height: 0, }}
                    // style={
                    //     position === 'left' ? { flexDirection: 'column', backgroundColor: Colors.gradiantOpaqeDown, marginLeft: 0, marginRight: 0, paddingHorizontal: 8 } :
                    //         { flexDirection: 'column', backgroundColor: Colors.gradiantOpaqeDown, marginRight: 0, paddingHorizontal: 8 }
                    // }
                    >
                        <Text style={{
                            ...styles.fileText,
                        }} >
                            {/* {currentMessage?.text} */}
                        </Text>
                        {/* {defaultMessage(offerDetail, offerUserDetail)} */}
                    </View>
                }
            </>
        );
    }
    if (currentMessage.file && currentMessage.file.url) {
        return (
            <View>

                {/* <Components.InChatViewFile
                    props={currentMessage?.file?.url?.includes('http')? currentMessage?.file?.url :IMAGE_URl + currentMessage?.file?.url}
                    visible={fileVisible}
                    onClose={() => setFileVisible(false)}
                /> */}

                <Pressable
                // underlayColor={Colors.transparent}
                    // activeOpacity={Colors.selectedBg}
                    // android_ripple={{color:'rgba(255,255.255,1)'}}
                    onPress={() => {
                        setSelectedMessage(currentMessage),
                        setFileVisible(true)
                    }

                    }
                    style={{
                        ...styles.fileContainer,
                        marginLeft: props.currentMessage.user._id === myProfileDetail?._id ? 95 : 0,
                        marginRight: props.currentMessage.user._id === myProfileDetail?._id ? 0 : 95,
                        backgroundColor: props.currentMessage.user._id === myProfileDetail?._id ? '#625EF1' : '#EBEBEB',
                        borderBottomLeftRadius: props.currentMessage.user._id === myProfileDetail?._id ? 15 : 5,
                        borderBottomRightRadius: props.currentMessage.user._id === myProfileDetail?._id ? 5 : 15,
                        borderTopRightRadius: props.currentMessage.user._id === myProfileDetail?._id ? 4 : 18,
                        borderTopLeftRadius: props.currentMessage.user._id === myProfileDetail?._id ? 18 : 4,
                    }}
                >
                    <>
                   
                  
                    
                        {/* <Components.InChatFileTransfer
                    // style={{ marginTop: -10 }}
                    filePath={currentMessage.file.url}
                /> */}
                        <View style={{ padding: 1.2 }}>
                            <Image
                                style={{
                                    borderRadius: 13,
                                    height: width / 2.3,
                                    margin: 3,
                                    width: width / 2,
                                    backgroundColor:Colors.app_Bg
                                }}
                                // style={{ height: 125, width: 150, backgroundColor: Colors.app_White, borderRadius: 15 }}
                                resizeMode={ImageEnum.contain}
                                source={ImagePath.pdf} />

                        </View>
                   
                    <Pressable
                        // android_ripple={{color:'rgba(255,255.255,0.1)'}}
                        onLongPress={() => currentMessage?.text && handleBubbleLongPress(currentMessage.text)}
                    >
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{
                                ...styles.fileText,
                                textAlign: props.currentMessage.user._id === myProfileDetail?._id ? 'left' : 'right',
                                marginRight: props.currentMessage.user._id === myProfileDetail?._id ? 10 : 0,
                                color: props.currentMessage.user._id === myProfileDetail?._id ? Colors.text_White : Colors.text_Black,
                            }} >
                                {currentMessage.text}
                            </Text>
                            <Text style={{
                                ...styles.timeStyle,
                                textAlign: props.currentMessage.user._id === myProfileDetail?._id ? 'right' : 'left',
                                marginRight: props.currentMessage.user._id === myProfileDetail?._id ? 10 : 0,
                                marginLeft: props.currentMessage.user._id === myProfileDetail?._id ? 0 : 10,
                                color: props.currentMessage.user._id === myProfileDetail?._id ? Colors.text_White : Colors.text_Black,
                            }} >
                                {moment(currentMessage?.createdAt).format('hh:mm A')}
                            </Text>
                        </View>
                    </Pressable>
                    </>
                </Pressable>

            </View>
        );
    }
    return (
        <>

            <Bubble

                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: Colors.chatBlue
                    },
                    left: {
                        backgroundColor: Colors.chatGray,
                    }
                }}
                textStyle={{
                    right: {
                        color: '#efefef',
                    },
                }}
                renderMessageImage={renderMessageImage}
                renderCustomView={renderCustomView}
                // renderTicks={renderSeen}
                isCustomViewBottom={true}
                tickStyle={{ color: 'red' }}
            >
                {<Image source={ImagePath.copy} style={{ height: 10, width: 10 }} />}

                {/* <View
                    style={{ backgroundColor: 'red', height: 20, width }}
                >
                </View> */}
            </Bubble>

        </>
    );
};
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.app_White
        // justifyContent: 'center',

    },
    innerContainer: {
        // flex: 1,
        // marginBottom: moderateScale(0),
        flex: 1,

    },
    userDetail: {
        backgroundColor: Colors.app_White, borderBottomEndRadius: 10, borderBottomStartRadius: 10,
        shadowColor: Colors.app_Black,
        shadowRadius: 3,
        shadowOpacity: 0.4,
        borderRadius: 4,
        shadowOffset: { height: 1, width: 1 },
        elevation: 5,
    },
    userDetailCont: {
        // paddingHorizontal: moderateScale(20),
        // flex: 1
    },

    userImage: {
        height: moderateScale(50), width: moderateScale(50), borderRadius: 8, backgroundColor: Colors.app_White
    },
    dropDownImage: {
        width: moderateScale(20), resizeMode: 'contain', height: moderateScale(22)
    }
    , userName: {
        fontSize: textScale(16),
    },
    userDisc: {
        color: Colors.text_DarkGray,
        marginRight: 0,
        textAlign: 'left',
        fontSize: textScale(12),
    }, sendContainer: {
        marginRight: 15,
    }, messageTextInput: {

    },
    chatFooter: {
        backgroundColor: Colors.gradiantOpaqeDown,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    }, buttonFooterChatImg: {
        height: 60,
        width: 60,
        // marginBottom:20,
    }, buttonFooterChat: {
        backgroundColor: Colors.app_Trans_White,
        borderRadius: 100,
        borderColor: Colors.app_Black,
        borderWidth: 1.2,
        marginRight: -5,
        marginTop: -5,
        height: 20, width: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }, textFooterChat: {
        height: 100,
        width: 100
    }, fileContainer: {
        flex: 1,
        marginVertical: 1,
        marginHorizontal: 0,
        paddingBottom: 5
    }, disputeText: {
        paddingHorizontal: 15,
        paddingVertical: 2,
        fontFamily: AppFonts.regular,
        fontSize: 15
    }, fileText: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontFamily: AppFonts.regular,
        fontSize: 15
    }, timeStyle: {
        fontFamily: AppFonts.regular,
        textAlign: 'right',
        fontSize: 10,
        marginRight: 10,
    }, imageLoader: {
        backgroundColor: Colors.transparent
    }, systemMessageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: '#e0e0e0',
    },
    systemMessageText: {
        ...TextStyles.regularMedium,
        color: Colors.text_Black,
        lineHeight: 20,
        letterSpacing: 0.5,
        fontSize: 13,
        // color: '#757575',
    },
    higlighText: {
        fontFamily: AppFonts.bold,
        color: Colors.text_Black,
        fontSize: 15
    },
    absoluteOffer: {
        position: 'relative', top: -height / 3.5
    }
});

// export default RenderBubble

export default React.memo(RenderBubble);