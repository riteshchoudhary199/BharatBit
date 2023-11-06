//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, StatusBar, } from 'react-native';
import Colors from '../../../Colors/Colors';
import * as Components from "../../../Components/indexx"
import { Alerts, Constants, En, ImagePath, Titles } from '../../../Constants';
import { moderateScale, scale, textScale } from '../../../Styles/responsiveSize';
import { TextStyles } from '../../../Styles/ComnStyle';
import { copyText, showAlertMessage } from '../../../Utils/helperFunctions';
// import Web3, { eth, providers } from 'web3'
// import {ethers} from 'ethers'
// import { ADMIN_ETH_ACCOUNT } from "@env"
import { providerMetadata, sessionParams } from '../../../Constants/walletConfig';
import Actions from '../../../Redux/Actions';
import { useSelector } from 'react-redux';
import { walletConnectConfig } from '../../../Utils/WalletConnect';
import { keys } from '../../../Constants/Privates';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

// create a component
const CoinDetail = ({ navigation, route }) => {
    
    const coinDetailsArr = useSelector((state) => state?.auth?.coinDetails)
    const lastScreenData = route?.params
    let selectedCoin = coinDetailsArr?.find(data => data?.name == lastScreenData?.name)
     const {isOpen,
        open,
        close,
        provider,
        isConnected,
        address,
        web3Provider,ethers}= walletConnectConfig()
     console.log(isConnected,"isConnectedisConnectedisConnectedisConnected");
    const [signatueId, setSignatureId] = useState('')
    // const web3Provider = new ethers.providers.Web3Provider(provider)
     const [accounts, setAccounts] = useState([])
     const [showModal, setShowModal] = useState(false)
     const isFocused = useIsFocused();
    const fetchCopiedText = async () => {
    };

    const btnArr = [
        { id: 1, name: Titles.Transfer, image: ImagePath.transfer },
        { id: 2, name: Titles.Deposit, image: ImagePath.deposit },
        { id: 3, name: Titles.Withdraw, image: ImagePath.withdraw }
    ]

    const closeAlert = () => {
        setShowModal(false)
        return true
    }
useFocusEffect(
    React.useCallback(() => {
        console.log('res address address address address is : -- ', address)
        updateAmount()
        if (provider){
            provider.once('chainChanged',chainChanged)
            provider.once('disconnect',disconnectedFromChain)
            provider?.once("connect",userConnected)
        }
        return () =>removeObservers();
      }, [])
)


useEffect(React.useCallback(() => {
    updateAmount
  }, [isFocused]))
const removeObservers = () =>{
    provider.removeListener('chainChanged',chainChanged)
    provider.removeListener('disconnect',disconnectedFromChain)
    provider.removeListener('connect',userConnected)
}

const updateAmount = () => {
    Actions.userProfileAction()
}
    // MARK : -- Connect wallet 
    const onConnectAlert = async () => {
        setShowModal(false)
       console.log(isConnected,"isConnectedisConnected isConnected isConnected");
        if (!isConnected) {
           open()
        // provider?.connect()
      
        }
    }
    const disconnectedFromChain =(data)=>{
        console.log('user disconnectedFromChain the chain coin detail',data)
       }
    const chainChanged =(data)=>{
     console.log('user change the chain from coin detail',data)
    }
    const userConnected =()=>{
        console.log('user userConnected with the chain')
        let data = { ...lastScreenData, type: Titles.Deposit, userAddress: address}
        navigation.navigate(Constants.transfer, data)
    }
    const depositAmount = async () => {
        console.log('connected or not------;', isConnected)
        if (!isConnected) {
            setShowModal(true)
        } else {
            // transferEths()
            // usdtTransaction()

            // const senderAddress = ethereum.selectedAddress
            // console.log('wallet already connected')
            let data = { ...lastScreenData, type: Titles.Deposit, userAddress: address}
            navigation.navigate(Constants.transfer, data)
        }

    }
    /*
    const personalSign = async () => {
        console.log('address from personalSign :----   ', address)
        const message = 'Hello World';
        const hexMsg = 'dshdahdahljdj'
        const connect = await provider.connect().then((res) => {
            console.log('res from eterium  provider.connect signature :----   ', res)
            
            // provider.cleanupPendingPairings
            // let data = {...lastScreenData,type:Titles.Deposit}
            // navigation.navigate(Constants.transfer, data)
        }).catch((err) => {
            console.log('error from eterium provider.connect signature :----   ', err)
        })

        console.log('signature from provider.connect provider.connect:----   ', connect)
        const signature = await provider?.request(
          { method: 'personal_sign', params: [hexMsg, address] },
        //   'eip155:1' //optional
        ).then((res) => {
            console.log('res from eterium transaction while signature :----   ', res)
            setSignatureId(res)
            // provider.cleanupPendingPairings
            // let data = {...lastScreenData,type:Titles.Deposit}
            // navigation.navigate(Constants.transfer, data)
        }).catch((err) => {
            console.log('error from eterium transaction while signature :----   ', err)
        })
        
        console.log('signature from eterium signature signature signature :----   ', signature)

    } */


    // const transferEths = async () => {
    //     // {signatueId == undefined &&
    //     //     // personalSign()
    //     // }
    //     const tx = [
    //         {
    //             from: address,
    //             to: keys.ADMIN_MetaMask_Addr,
    //             data: "0x",
    //             gasPrice: "0x029104e28c",
    //             gas: "0x5208",
    //             value: 0.0001 * (10 ** 18),
    //         },
    //     ];
    //     const transaction = await provider?.request(
    //         { method: 'eth_sendTransaction', params: tx },
    //         // 'eip155:1' //optional
    //     ).then((res) => {
    //         console.log('res from eterium transaction :----   ', res)

    //         // provider.cleanupPendingPairings
    //         // let data = {...lastScreenData,type:Titles.Deposit}
    //         // navigation.navigate(Constants.transfer, data)
    //     }).catch((err) => {
    //         console.log('error from eterium transaction :----   ', err)
    //     })
    //     console.log('transaction transaction transaction transaction transaction :----   ', transaction)
    // };

    const disconnectWallet = async () => {
        // let auth = MMSDK.disconnect()
        if (isConnected) {
            provider.disconnect()
        } else {
            setShowModal(true)
        }
    }


    const onPressButton = async (data) => {
        switch (data.id) {
            case 1:
                // if (lastScreenData.name == 'Bitcoin'){
                //     showAlertMessage('under Working')
                //     return
                // }
                let data = { ...lastScreenData, type: Titles.Transfer }
                navigation.navigate(Constants.transfer, data)

                break
            case 2:
                if (lastScreenData.name == 'Bitcoin') {
                    showAlertMessage('under Working')
                    return
                }
                depositAmount()
                break
            case 3:
                if (lastScreenData.name == 'Bitcoin') {
                    showAlertMessage('under Working')
                    return
                }
                navigation.navigate(Constants.withdraw, lastScreenData)
                break
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
             <StatusBar backgroundColor={Colors.app_Bg} barStyle={'dark-content'} />
            <View style={styles.container}>
                <Components.BackBtnHeader
                // onPressBackBtn={()=> provider && provider.disconnect()}
                    navigation={navigation}
                    isSowText={false}
                    centerheaderTitle={`${lastScreenData?.name} ${En.Wallet}`}
                />
                <View style={styles.innerContaier}>
                    <View style={{ ...styles.detailBox, paddingTop: isConnected ? moderateScale(10) : moderateScale(20) }}>

                        {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}> */}

                        <Text
                            onPress={disconnectWallet}
                            style={{
                                color: isConnected ? Colors.text_Green_dark : Colors.text_red_dark,
                                marginBottom: moderateScale(0),
                                marginRight: moderateScale(-20),
                                alignSelf: 'flex-end'
                            }}
                        >{isConnected ? 'Connected' : 'Disconnected'}</Text>

                        {/* MARK coin balance container */}

                        <View style={{ gap: moderateScale(5), alignItems: 'center', }}>
                            <Components.LoaderImage
                                imageUrl={lastScreenData?.logo || ''}
                                style={{ height: scale(60), width: scale(60) }}
                            />
                            <Text
                                style={{ ...TextStyles.medium, color: Colors.darkGrayTxt }}
                            >{`${En.Total} ${lastScreenData?.name || ''}`}
                            </Text>
                            <Text style={{ ...TextStyles.extraBold, }}>
                                {`${selectedCoin?.balance || '0'}`}
                            </Text>

                        </View>

                        {/* MARK seprator */}
                        <View
                            style={{
                                backgroundColor: Colors.seprator, height: 1.2,
                                width: '80%', zIndex: 999, opacity: 1
                            }} />
                        {/* MARK Address */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: moderateScale(5), marginTop: moderateScale(5) }} >
                            <Text
                                style={{ ...TextStyles.small, fontSize: textScale(12), color: Colors.text_DarkGray }}
                            >Wallet Address:
                            </Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='middle'
                                style={{ ...TextStyles.medium, fontSize: textScale(12), maxWidth: moderateScale(80), color: Colors.darkGrayTxt }}
                            >{`${'1232131232112312313213123'}`}</Text>
                            <TouchableHighlight
                                underlayColor={Colors.app_White}
                                onPress={()=>copyText('1232131232112312313213123')}
                            >
                                <Image
                                    style={{ height: 15, width: 10 }}
                                    resizeMode='contain'
                                    source={ImagePath.copy}
                                />
                            </TouchableHighlight>
                        </View> */}
                        {/* MARK buttons */}
                        <View
                            style={{ flexDirection: 'row', gap: moderateScale(25), marginTop: moderateScale(10) }}
                        >
                            {btnArr.map((data) => {
                                // buttonsView(data)
                                return (

                                    <View style={{ gap: moderateScale(8), alignItems: 'center', borderRadius: 10, overflow: 'hidden', justifyContent: 'center', }}>

                                        <View
                                            style={{ borderRadius: 10, overflow: 'hidden' }}
                                        >
                                            <TouchableHighlight
                                                onPress={() => onPressButton(data)}
                                            >
                                                <Components.LoaderImage
                                                    imageUrl={Image.resolveAssetSource(data.image).uri}
                                                    style={{ height: scale(65), width: scale(68), overflow: 'hidden' }}
                                                />
                                            </TouchableHighlight>
                                        </View>
                                        <Text
                                            style={{
                                                ...TextStyles.medium,
                                                fontSize: textScale(14),
                                                maxWidth: moderateScale(80), color: Colors.darkGrayTxt
                                            }}>
                                            {`${data.name}`}
                                        </Text>
                                    </View>
                                )

                            })}
                        </View>
                    </View>
                </View>

                {/* <Text>coinDetail</Text> */}
            </View>

            <Components.CustomPopUp
                onHardwareBackPress={closeAlert}
                onClickTouchOutside={closeAlert}
                scaleAnimationDialogAlert={showModal}
                HeaderTitle={Alerts.OPPS}
                AlertMessageTitle={Alerts.PLZ_CONNECT_WALLET}
                leftBtnText={Titles.Cancel}
                rightBtnText={Titles.Connect}
                onPressLeftBtn={closeAlert}
                onPressRightBtn={onConnectAlert}
            />
           
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContaier: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: moderateScale(25)
    },
    detailBox: {
        backgroundColor: Colors.app_White,
        paddingHorizontal: moderateScale(40),
        paddingBottom: moderateScale(25),
        borderRadius: 15,
        borderColor: Colors.border_textfld_dark,
        borderWidth: 1.2
    }
});

//make this component available to the app
export default CoinDetail;
