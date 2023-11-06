
// import { numberToHex, sanitizeHex, utf8ToHex } from '@walletconnect/encoding';
// import { walletConnectConfig } from './WalletConnect';
import { sanitizeHex } from '@walletconnect/encoding';
import { showAlertMessage, success } from './helperFunctions';

// Mark : Validate to check ETH transaction

export const validateEthTransaction = async(web3Provider,address,amount,ethers) =>{

    const ethBalaceInWie = await getEthereumBalanceInWei(web3Provider,address)
    const ethBalaceInNum =  ethers.utils.formatEther(ethBalaceInWie) //await getEthBalanceInNumbers(web3Provider,address,ethers)
    
    console.log("ethBalace is number : ---",ethBalaceInNum)
    console.log("ethBalace ethBalaceInWie is  : ---",ethBalaceInWie)
    const gasPrice = await getGasPriceInWei(web3Provider)
    console.log("gasPrice is : ---",ethBalaceInWie)
    const totalWei = ethBalaceInWie.add(gasPrice);
    const weiAmount = ethers.utils.parseEther(amount)   
    const totalWeiAmount = weiAmount.add(gasPrice);
    const gasInNum = ethers.utils.formatEther(gasPrice)
    console.log("gasInNum is : ---",gasInNum)
    const totalAmmount = ethers.utils.formatEther(totalWeiAmount)
    console.log("totalAmount is : ---",totalAmmount)
    if (!ethBalaceInWie){
        return false
    }
    if (!gasPrice){
        return false
    }
    console.log('amount is : --', amount)
    if (ethBalaceInNum<amount){
        showAlertMessage("Sorry you don't have enoungh ETH." )
        return false
      } 
    else if (!ethBalaceInWie.gt(totalWei)) {
        // showAlertMessage("Your Ethereum balance is greater than gas price.",success)
        return true
      } else {
        showAlertMessage("Your Ethereum balance is not enough for gas." )
        return false
      }
      return true
    }
// Mark : Validate to check USDT transaction
export const validateUsdtTransaction = async(web3Provider,tokenContract,address,amount,ethers) =>{

const usdtBalance = await getUsdtBalanceInNumbers(tokenContract,address,ethers) 
if (!usdtBalance){
    return false
}
const ehBalace = await getEthereumBalanceInWei(web3Provider,address)
if (!ehBalace){
    return false
}
const gasPrice = await getGasPriceInWei(web3Provider)

if (!gasPrice){
    return false
}
console.log('amount is : --', amount)
if (parseInt(amount, 10) > parseInt(usdtBalance, 10) ){
    showAlertMessage("Sorry you don't have enoungh USDT" )
    return false
} 

else if (ehBalace.gt(gasPrice)) {
    showAlertMessage("Your Ethereum balance is greater than gas price.",success)
    return true
  } else {
    showAlertMessage("Your Ethereum balance is not enough for gas." )
    return false
  }
  return true
}

export  async function getEthereumBalanceInWei(web3Provider,address) {

    try {
      const balanceWei = await web3Provider.getBalance(address);
      return balanceWei;
    } catch (error) {
      console.error('Error fetching Ethereum balance:', error);
      return false;
    }
  }

const getEthBalanceInNumbers = async (web3Provider,address,ethers) => {
// const {web3Provider,ethers} = walletConnectConfig()

    // try {
        // const provider =  ethers.providers.getDefaultProvider(provider)
        const balance = await web3Provider.getBalance(address);
        console.log("Your Echeck Balance is : -- ", balance)
        let balanceInNum = ethers.utils.formatEther(balance);
        if (balanceInNum){
          return
        }else{
          return false
        }
         
    // } catch (error) {
    //     console.error('Error checking balance:', error);
    //     console.log('Error checking balance:', error)
    //     throw error;
    // }
};


  export const getGasPriceInWei = async (web3Provider) => {
// const {web3Provider} = walletConnectConfig()

    try {
        const gasPrice = await web3Provider.getGasPrice();
        return gasPrice;
      } catch (error) {
        console.error('Error fetching gas price is:', error);
        return false;
      }
}
export const getUsdtBalanceInNumbers = async (tokenContract,address,ethers) => {
// const {address,} = walletConnectConfig()
// console.log('getUsdtBalanceInNumbers tokenContract is : --- ',tokenContract)
    // try {
        // const provider =  ethers.providers.getDefaultProvider(provider)
        const balance = await tokenContract.balanceOf(address)
        const ethInNum = ethers.utils.formatUnits(balance, 6);
        console.log("Your Echeck Usdt Balance is : -- ", balance)
        if (ethInNum){
        return ethInNum
      }else{
        return false
      }
    // } catch (error) {
    //     console.error('Error checking Usdt balance:', error);
    //     console.log('Error checking Usdt balance:', error)
    //     showAlertMessage('Something went wrong to fetch USDT')
    //     // throw error;
    //     return false
    // }
}


// import messaging from '@react-native-firebase/messaging';
// import { Platform } from 'react-native';
// // import NavigationService from './NotificationNavigationService';
// import notifee, { AndroidImportance } from '@notifee/react-native';
// import NotificationSounds, { playSampleSound } from  'react-native-notification-sounds';
// import { Constants } from '../Constants';
// import NavigationService from '../Services/NavigationService';
// export async function requestUserPermission() {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//         console.log('Authorization status:', authStatus);
//         getFcmToken()
//     }
// }

// const getFcmToken = async () => {

//     try {
//         const token = await messaging().getToken()
//         console.log("fcm token:", token)
//     } catch (error) {
//         console.log("error in creating token")
//     }

// }



// async function onDisplayNotification(data) {
//     // Request permissions (required for iOS)

//     if (Platform.OS == 'ios') {
//         await notifee.requestPermission()
//     }

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//         id: 'default', //data?.data?.channel_id,
//         name: 'System Sound',//data?.data?.channel_name,
//         sound:  'default',//data?.data?.sound_name,
//         importance: AndroidImportance.HIGH,
        
//     });

//     // Display a notification
//     await notifee.displayNotification({
//         title: data?.notification.title,
//         body: data?.notification.body,
//         android: {
//             channelId,

//         },
//     });
   
    
// }

// export async function notificationListeners() {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//         console.log('A new FCM message arrived!', remoteMessage);
//         setTimeout(() => {
//             NavigationService.navigate(Constants.account, { data: 'remoteMessage?.data' })
//                 }, 1200);
      
//         onDisplayNotification(remoteMessage)
//     });


//     messaging().onNotificationOpenedApp(remoteMessage => {
//         console.log(
//             'Notification caused app to open from background state:',
//             remoteMessage,
//         );
//         setTimeout(() => {
//             NavigationService.navigate(Constants.account, { data: 'remoteMessage?.data' })
//                 }, 1200);
      
//         // if (!!remoteMessage?.data && remoteMessage?.data?.redirect_to == "ProductDetail") {
//         //     setTimeout(() => {
//         //         NavigationService.navigate("ProductDetail", { data: remoteMessage?.data })
//         //     }, 1200);
//         // }

//         // if (!!remoteMessage?.data && remoteMessage?.data?.redirect_to == "Profile") {
//         //     setTimeout(() => {
//         //         // NavigationService.navigate("Profile", { data: remoteMessage?.data })
//         //     }, 1200);
//         // }
//     });

//     // Check whether an initial notification is available
//     messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//             if (remoteMessage) {
//                 console.log(
//                     'Notification caused app to open from quit state:',
//                     remoteMessage.notification,
//                 );

//             }
//         });
//     return unsubscribe;
// }