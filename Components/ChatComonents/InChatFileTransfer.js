import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors, ImagePath } from '../../Constants';
import { moderateScale, width } from '../../Styles/responsiveSize';

const InChatFileTransfer = ({ filePath, onPressDelete, style }) => {
    var fileType = '';
    var name = '';
    if (filePath !== undefined) {
        name = filePath.split('/').pop();
        fileType = filePath.split('.').pop();
    }
    return (
        <View style={{ ...styles.container, ...style }}>
            <View style={{ ...styles.innerContainer, }}>
                <View
                    style={styles.frame}
                >
                    <Image
                        source={
                            fileType === 'pdf'
                                ? ImagePath.pdf
                                : ImagePath.demoPerson
                        }
                        style={{ height: moderateScale(60), width: moderateScale(60) }}
                    />
                    <View>
                        <Text style={styles.text}>
                            {name.replace('%20', '').replace(' ', '')}
                        </Text>
                        <Text style={styles.textType}>{fileType.toUpperCase()}</Text>
                    </View>
                    <View style={{ ...styles.buttonFooterChat }}>
                        <TouchableOpacity
                            onPress={onPressDelete}
                        >

                            <Image source={ImagePath.cancel}
                                style={{ height: 25, width: 25 }}
                                resizeMode='center' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                </View>
            </View>
        </View>
    );
};
export default InChatFileTransfer;

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        // flex: 1,
        // marginTop: 5,
        // borderRadius: 15,
        // padding: 5,

    },
    text: {
        color: 'black',
        marginTop: 10,
        fontSize: 16,
        lineHeight: 20,
        marginLeft: 5,
        marginRight: 5,
        maxWidth: width / 1.5
    },
    textType: {
        color: 'black',
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    innerContainer: {

        flexDirection: 'row', justifyContent: 'space-between',
        backgroundColor: '#fff',
        // backgroundColor: 'red',
        flexDirection: 'row',
        borderRadius: 10,
        padding: 5,
        marginTop: -4,
    },
    frame: {
        flex: 1,
        backgroundColor: '#fff',
        // backgroundColor: 'red',
        flexDirection: 'row',
        // borderRadius: 10,
        padding: 5,
        marginTop: -4,
    },
    buttonFooterChat: {
        position: 'absolute',
        backgroundColor: Colors.app_White,
        borderRadius: 100,
        borderColor: Colors.app_Black,
        top: -2,
        right: -5,
        borderWidth: 1.2,
        height: 25, width: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
});