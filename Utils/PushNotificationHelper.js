

import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
// import NavigationService from './NotificationNavigationService';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { setFcmToken } from './Utility';
import { useRoute, getFocusedRouteNameFromRoute } from '@react-navigation/native';
// import NavigationService from '../Services/NavigationService';
import { Constants } from '../Constants';
import NavigationService from '../Services/NavigationService';
import { useSelector } from 'react-redux';
import Actions from '../Redux/Actions';




export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken()
    }
}



export async function onDisplayNotification(data) {
    // Request permissions (required for iOS)

    if (Platform.OS == 'ios') {
        await notifee.requestPermission()
    }

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default', //data?.data?.channel_id,
        name: 'System Sound',//data?.data?.channel_name,
        sound: 'default',//data?.data?.sound_name,
        importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
        // id:data?.data?.messageId,
        title: data?.notification.title,
        body: data?.notification.body,
        data: data?.data,

        android: {
            channelId,

        },
    });
    await Actions.getNotificationsCount()

}
const getFcmToken = async () => {
    try {
        const token = await messaging().getToken()
        setFcmToken(token)
        console.log("fcm getFcmToken token:", token)
    } catch (error) {
        console.log("error in creating token")
    }
}


export const notificationListeners = async () => {
    // const openChatId  = useSelector((state) => state)
    // const openChatId  = useSelector((state) => state)

    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);
    Actions.setNewNotification(remoteMessage)

        await handelNotificationOnForground(remoteMessage)

    });

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
        );
        // setTimeout(() => {
        // NavigationService.navigate(Constants.account, { data: 'remoteMessage?.data' })
        // }, 1200);

        // if (!!remoteMessage?.data && remoteMessage?.data?.redirect_to == "ProductDetail") {
        //     setTimeout(() => {
        //         NavigationService.navigate("ProductDetail", { data: remoteMessage?.data })
        //     }, 1200);
        // }

        // if (!!remoteMessage?.data && remoteMessage?.data?.redirect_to == "Profile") {
        //     setTimeout(() => {
        //         // NavigationService.navigate("Profile", { data: remoteMessage?.data })
        //     }, 1200);
        // }
    });

    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );

            }
        });
    return unsubscribe;
}

export const handelNotificationOnForground = async (remoteMessage) => {
    const route = NavigationService.getCurrentRoute()

    const routeName = route?.name//NavigationService.getCurrentRouteName()
    const params = route?.params//chatExchangeId
    console.log('routeName routeName : --  ', routeName);
    console.log('useRoute useRoute useRoute:---', routeName)
    const data = remoteMessage?.data
    const controller = data?.controller

    switch (controller) {
        case 'chats':
            if ((routeName == Constants.chat) && (controller === 'chats') && data?.chatexchange == params?.chatExchangeId) {
                break
            } else {
                onDisplayNotification(remoteMessage)
                break
            }
        default:
            onDisplayNotification(remoteMessage)
    }
}

export const handelOnPressNotification = (remoteMessage) => {
    const notifi = remoteMessage?.notification
    const data = notifi.data

    const route = NavigationService.getCurrentRoute()

    const routeName = route?.name//NavigationService.getCurrentRouteName()
    const params = route?.params//chatExchangeId
    console.log('routeName routeName : --  ', routeName);
    console.log('useRoute useRoute useRoute:---', routeName)

    const controller = data?.controller

    switch (controller) {
        case 'chats':
            if ((routeName != Constants.chat) && (controller === 'chats') && data?.chatexchange !== params?.chatExchangeId) {
                let payLoadParams = {
                    chatExchangeId: data?.chatexchange,
                    // offer_id: offer_details?._id,
                    // receiver_id: userDetail?._id
                }
                setTimeout(() => {
                    NavigationService.navigate(Constants.chat, payLoadParams)
                }, 1200);

                break
            } else {
                // onDisplayNotification(remoteMessage)
                break
            }
        default:
        // onDisplayNotification(remoteMessage)


    }

}