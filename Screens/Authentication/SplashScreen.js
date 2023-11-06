import React, { useEffect } from 'react';
import { StyleSheet } from "react-native";
import { Constants } from '../../Constants';
import { ImagePath, ImageEnum } from '../../Constants'
import Video from 'react-native-video';
import { useSelector } from 'react-redux';

const SplashScreen = ({ navigation }) => {
    const {userLoginStatus} = useSelector((state)=>state?.auth)

    const _onMoveToNextScreen = () => {
        navigation.navigate(userLoginStatus?.token? Constants.dealsTab :Constants.login);
    }

    return (
        <Video
            source={ImagePath.splashVideo}
            paused={false}
            style={styles.videoStyle}
            repeat={true}
            onEnd={_onMoveToNextScreen}
            resizeMode={ImageEnum.cover}
        />
    );
};
export default SplashScreen;
const styles = StyleSheet.create({
    videoStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
})
