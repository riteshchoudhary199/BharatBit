//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ImagePath } from '../Constants';
import Colors from '../Colors/Colors';


// create a component
const LoaderImage = ({ imageUrl,
    placeHolderUrl = Image.resolveAssetSource(ImagePath.demoPerson).uri ,
    style,indicatorSize = 'large',indicatorColor = Colors.gradiantDwn,containerStyle,
resizeMode = FastImage.resizeMode.cover
}) => {
    const [isloaded, setLoaded] = useState(false)
    // console [isloadingStatus,setLoadedStatus]= useState(false)
const [image,setImage] = useState(imageUrl?imageUrl:placeHolderUrl)
    return (
        <>
            <View style={{...styles.container,...containerStyle}}>
                <FastImage
                    style={style}
                    source={{
                        // uri:Image.resolveAssetSource(ImagePath.demoPerson).uri
                        uri: image,//imageUrl ? imageUrl : placeHolderUrl,
                    }}
                    resizeMode={resizeMode}
                    onLoadStart={e => console.log('Loading Start')}
                    onProgress={(e) =>
                        // console.log('Loading Progress ' + e.nativeEvent.loaded / e.nativeEvent.total)
                        setLoaded(false)
                    }
                    onLoad={e =>
                        setLoaded(false)
                        // console.log('Loading Loaded ' + e.nativeEvent.width, e.nativeEvent.height)
                    }
                    onLoadEnd={e =>
                        setLoaded(true)
                        // console.log('Loading Ended')
                    }
                    onError={e =>
                        {setLoaded(false)
                        setImage(placeHolderUrl)
                    }
                        // console.log('Loading Loaded ' + e.nativeEvent.width, e.nativeEvent.height)
                    }
                />
                {!(isloaded) &&

                    <ActivityIndicator size={indicatorSize} color={indicatorColor}

                        style={styles.indicator}
                    />
                }


            </View>
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        alignItems: 'center', justifyContent: 'center',
    },
    indicator: {
        // height: scale(23),
        // width: scale(23),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        // borderColor: Colors.gradiantDwn,
        // bottom: moderateScale(3),
        // right: moderateScale(10)

    }
});

//make this component available to the app
export default LoaderImage;
// export default React.memo(LoaderImage);
