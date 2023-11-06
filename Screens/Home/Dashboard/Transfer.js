//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Components from "../../../Components/indexx";
import Colors from '../../../Colors/Colors';
import { moderateScale, moderateScaleVertical, textScale } from '../../../Styles/responsiveSize';
import { Alerts, En, Titles } from '../../../Constants';
import { TextStyles } from '../../../Styles/ComnStyle';
import { convertNormalToMetaMaskPrice, danger, delayed, showAlertMessage, success, warning } from '../../../Utils/helperFunctions';
import Actions from '../../../Redux/Actions';
import { keys } from '../../../Constants/Privates';
// import Privates from '../../../Constants/Privates';

import { walletConnectConfig } from '../../../Utils/WalletConnect';
import { getEthereumBalanceInWei, validateEthTransaction, validateUsdtTransaction } from '../../../Utils/WalletHelper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { numberToHex, sanitizeHex } from '@walletconnect/encoding';
import { useSelector } from 'react-redux';
import NavigationService from '../../../Services/NavigationService';

// create a component
export const TextInputVw = ({ textValue, onChangeText = () => { }
    , placeholder = En.Enter_Manually, headerText, bottomText, containerStyle, keyboardType, editable, textStyle }) => {
    return (
        <View style={{ ...styles.textInput, containerStyle }}>
            <Text style={{ ...TextStyles.medium, ...styles.fieldHeader }}>{headerText}</Text>
            <Components.CustomTextInput
                textStyle={textStyle}
                innerContainerStyle={styles.textInputInnerContainer}
                value={textValue}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                isshowLeftImg={false}
                editable={editable}//{lastScreenData.type !='Deposit'}
            />
            {
                bottomText &&
                <Text style={{ ...TextStyles.medium, ...styles.orderDiscript }}>{bottomText}</Text>
            }
        </View>
    )

}
const Transfer = ({ navigation, route }) => {

    let { isOpen, open, close, provider, isConnected, address, web3Provider, ethers } = walletConnectConfig()
    const lastScreenData = route?.params
    const [walletAddress, setwalletAddress] = useState('')
    const [coinQty, setCoinQty] = useState("")
    const [transactionHash, setTransactionHash] = useState("")
    const [balance, setBalance] = useState('');
    const [loading, setLoading] = useState(false)
    const [updateChain, setUpdateChain] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const coinDetailsArr = useSelector((state) => state?.auth?.coinDetails)
    let selectedCoin = coinDetailsArr?.find(data => data?.name == lastScreenData?.name)
    const adminDetails = useSelector((state) => state?.wallet?.adminDetails)
    const myProfileDetail = useSelector((state) => state?.auth?.userDetail)
    const isFocused = useIsFocused()
    useFocusEffect(//()=>{
        React.useCallback(() => {
            console.log('res address address address address is : -- ', address)
            setLoading(false)
            if (provider) {
                provider.on('chainChanged', chainChanged)
                provider.on('disconnect', disconnectedFromChain)
            }
            // return () => removeObservers();
        }, [])
    )
console.log('myProfileDetailmyProfileDetailmyProfileDetailmyProfileDetailmyProfileDetail',myProfileDetail);

    // MARK : ----  Remove wallet providers
    const removeObservers = () => {
        provider.removeListener('chainChanged', chainChanged)
        provider.removeListener('disconnect', disconnectedFromChain)
        provider.removeListener('connect', chainChanged)
    }

    const disconnectedFromChain = (data) => {
        console.log('user disconnectedFromChain the chain from transfer ', data)
    }
    const chainChanged = (data) => {
        console.log('user change the chain from transfer : --', data)
        setUpdateChain(true)
    }
    useEffect(() => {
        addresssList()
        if (address) {
            // fetchBalace()
        }

    }, [updateChain])

    useEffect(() => {
        if (lastScreenData?.type == Titles.Deposit) {
            const name = lastScreenData?.name ? lastScreenData?.name?.toLowerCase() : ''
            setwalletAddress(adminDetails[name])
        }
    }, [adminDetails, isFocused])

    useEffect(() => {
        Actions.getAdminDetails()

    }, [])
    const checkSelectedNetwork = async (provider) => {
        try {
            const network = await provider.getNetwork();
            console.log('Selected network  network.chainId is :', network.chainId);
            const isMainnet = network.chainId === 1;

            console.log('Selected network is mainnet:', isMainnet);
            return isMainnet;
        } catch (error) {
            console.log('Error checking network:', error);
            console.error('Error checking network:', error);
            throw error;
        }
    };

    const addresssList = async () => {
        const [addresList] = await web3Provider.listAccounts();
        console.log('user addresList  is----=- : ---', addresList)

    }

    const closeAlert = () => {
        setShowModal(false)
        return true
    }

    const onPressConfirm = () => {
        closeAlert()
        if (lastScreenData.type == Titles.Deposit) {
            // MARK Add Ethers amount from Metamask wallet 
            if (lastScreenData?.name == "USDT") {
                // MARK Add Usdt amount from Metamask wallet 
                usdtTransaction()
            } else {
                transferEths()
            }
        }
        else {
            let payLoad =
            {
                coin: lastScreenData?.name,
                quantity: coinQty,
                receiver: walletAddress
            }
            if (walletAddress == '') {
                showAlertMessage(Alerts.PLZ_ENTR_WALLET_ADDRS, danger)
            } else if ((coinQty == '0') || (coinQty == '')) {
                showAlertMessage(Alerts.PLZ_ENTR_COIN_QTY, danger)

            } else if ((Number(coinQty) <= 0) || (coinQty == '')) {
                showAlertMessage(Alerts.PLZ_ENTR_VALID_COIN_QTY, warning)

            } else if (walletAddress.toString() === myProfileDetail?.username) {
                showAlertMessage(Alerts.PLZ_ENTR_VALID_USER_ADDRESS, warning)
            }else {
                transferToOtherPerson(payLoad)
            }
            // MARK trnsfer amount into other wallet 
        }
    }


    const onPressTransfer = () => {
        if (walletAddress == '') {
            showAlertMessage(Alerts.PLZ_ENTR_WALLET_ADDRS, warning)
        } else if ((coinQty == '0') || (coinQty == '')) {
            showAlertMessage(Alerts.PLZ_ENTR_COIN_QTY, warning)

        } else if ((Number(coinQty) <= 0)) {
            showAlertMessage(Alerts.PLZ_ENTR_VALID_COIN_QTY, warning)
        } else if ((Number(coinQty) > Number(selectedCoin?.balance)) && lastScreenData.type == Titles.Transfer) {
            showAlertMessage(Alerts.INSUFFI_BALANCE_IN_YOUR_ACCOUNT, warning)
        }else if (walletAddress.toString() === myProfileDetail?.username) {
            showAlertMessage(Alerts.PLZ_ENTR_VALID_USER_ADDRESS, warning)
        }
        else {
            Keyboard.dismiss()
            setShowModal(true)
        }

    }

    const transferEths = async () => {
        // {signatueId == undefined &&
        //     // personalSign()
        // }

        const isValidBuyer = ethers.utils.isAddress(walletAddress)
        const isValidSeller = ethers.utils.isAddress(address)

        if (!isValidBuyer) {
            // throw new Error('No address found');
            console.log('No address found')
            showAlertMessage('Invalidate deposting address')
            return
        } else if (!isValidSeller) {
            showAlertMessage('Invalidate sender address ')
            return
        }


        if (!address) {
            // throw new Error('No address found');
            console.log('No address found')
            showAlertMessage('No address found')
            return
        }

        if ((coinQty) && (coinQty <= 0)) {
            const balanceWei = await web3Provider.getBalance(address);
            console.log('balanceWei balanceWei balanceWei', balanceWei)
            const signer = web3Provider.getSigner();
            const [addresList] = await web3Provider.listAccounts();
            console.log('userAddress listAccounts is : --- ', addresList)
            const amountToSend = ethers.utils.parseUnits(coinQty, 'ether');
            console.log('amountToSend is :----   ', amountToSend)


            const transaction = {
                from: addresList,
                to: walletAddress,
                value: amountToSend,
                data: '0x',
            };

            // await provider?.request(
            //     { method: 'eth_sendTransaction', params: tx },
            //     // 'eip155:1' //optional
            // )
            // console.log('signer signer signer ;---',signer)
            const txResponse = await signer.sendTransaction(transaction)
                .then((res) => {
                    console.log('res from eterium transaction :----   ', res)
                    const hash = res?.hash
                    if (!hash) {
                        showAlertMessage('Sorry, No transaction id found.Please Contact us if ammaunt deducted')
                        return
                    }
                    let payLoad = {
                        to_wallet: keys.ADMIN_MetaMask_Addr,
                        from_wallet: address,
                        quantity: coinQty,
                        coin_symbol: lastScreenData?.name,
                        transaction_hash: hash || ''
                    }
                    if (res) {
                        depositInToPlatForm(payLoad)
                        setTransactionHash(res)
                    } else {
                        showAlertMessage('transaction hash value not found yet ')
                    }
                }).catch((err) => {
                    console.log('error from ether transaction :----   ', err?.code)
                    const msg = err?.code == 'INSUFFICIENT_FUNDS' ? `insufficient funds for Transaction ` : err?.message ? `code ${err?.code} : ,Message: ${err?.message}` : `Fail with err ${err.toString()}`
                    showAlertMessage(msg)
                    const wt = delayed()
                    NavigationService.goBack()
                })


            // Transaction was mined in block: {"accessList": [], "blockHash": null, "blockNumber": null, "chainId": 11155111, "confirmations": 0, "creates": null, "data": "0x", "from": "0xC9fB75d28061f10E8EF40e987C0bF4EA2268f9A3", "gasLimit": {"hex": "0x5208", "type": "BigNumber"}, "gasPrice": {"hex": "0x59682f1d", "type": "BigNumber"}, "hash": "0xe5a9c330e886d6b55f447f930cfa78c7714de49ccf5685fb8500404500dad054", "maxFeePerGas": {"hex": "0x59682f1d", "type": "BigNumber"}, "maxPriorityFeePerGas": {"hex": "0x59682f00", "type": "BigNumber"}, "nonce": 20, "r": "0x7b882f6b59914bb6fb1b5df1498d3cd5bcfd413b275561c2fa07079f4d3023b3", "s": "0x0d974a61fd4811b2dd344bdb2a4317d70ae6b769daa114037648c7e817cb0f87", "to": "0x38DD2d3D77FDc4aeAc12f2CbCAA014096f3B1288", "transactionIndex": null, "type": 2, "v": 0, "value": {"hex": "0x11c37937e08000", "type": "BigNumber"}, "wait": [Function anonymous]}
            const receipt = await txResponse.wait()

            let payLoad = {
                to_wallet: walletAddress,
                from_wallet: address,
                quantity: coinQty,
                coin_symbol: lastScreenData?.name,
                transaction_hash: receipt?.hash || ''
            }
            console.log('Transaction was mined in block:', receipt);
            // if (receipt?.hash) {
            //    await depositInToPlatForm(payLoad)
            //     setTransactionHash(res)
            // } else {
            //     showAlertMessage('transaction hash value not found yet ')
            // }

        } else {
            showAlertMessage('Please enter coin Qty first to continue')
        }

    };




    const usdtTransaction = async () => {
        if ((coinQty) && (Number(coinQty) > 0)) {
            if (!address) {
                showAlertMessage('No address found please Reconnect Walet')
            }
            console.log("address is : ---- ", address)
            const isValidBuyer = ethers.utils.isAddress(walletAddress)
            const isValidSeller = ethers.utils.isAddress(address)
    
            if (!isValidBuyer) {
                // throw new Error('No address found');
                console.log('No address found')
                showAlertMessage('Invalidate deposting address')
                return
            } else if (!isValidSeller) {
                showAlertMessage('Invalidate sender address ')
                return
            }
    
            const signer = web3Provider.getSigner();
            try {

                const tokenContract = new ethers.Contract(
                    keys.USDT_TOKEN_ADDRESS,
                    keys.USDT_ABI_JSON,
                    signer
                );
                // MARK:-- check total balance in account 
                // const balance = await tokenContract.balanceOf(address)
                // const ethInNum = ethers.utils.formatUnits(balance, 6);
                // console.log("Your Echeck Usdt Balance is : -- ", ethInNum)

                // showAlertMessage('No USDT found')
                const validate = await validateUsdtTransaction(web3Provider, tokenContract, address, coinQty, ethers)

                if (!validate) {
                    showAlertMessage('No USDT found')
                    return
                }

                const tokenDecimals = 6;
                const amountInBaseUnits = ethers.utils.parseUnits(coinQty.toString(), tokenDecimals);
                console.log("USDT amount:", amountInBaseUnits.toString());
                setLoading(true);
                const transferTx = await tokenContract.transfer(walletAddress, amountInBaseUnits).then((res) => {
                    console.log('res from USDT transaction is :----   ', res)
                    // if (res){
                    //     setTransactionHash(res)

                    // }
                    let payLoad = {
                        to_wallet: walletAddress,
                        from_wallet: address,
                        quantity: coinQty,
                        coin_symbol: lastScreenData?.name,
                        transaction_hash: res?.hash || ''
                    }
                    if (res) {
                        depositInToPlatForm(payLoad)
                        setTransactionHash(res)
                    } else {
                        showAlertMessage('USDT hash value not found yet ')
                    }
                }).catch((err) => {

                    setLoading(false);
                    console.log('error from ether transaction :----   ', err?.code)
                    const msg = err?.code == 'INSUFFICIENT_FUNDS' ? `insufficient funds for Transaction ` : err?.message ? `code ${err?.code} : ,Message: ${err?.message}` : `Fail with err ${err.toString()}`
                    showAlertMessage(msg)
                    const wt = delayed()
                    NavigationService.goBack()

                })
                // contract.transfer(recipientAddress,amount,signer)
                console.log("USDT transferHash is : -- :", transferTx);

            } catch (error) {
                setLoading(false);
                console.log("Error while USDT transaction:", error?.code);
                const mesg = error?.code == 'CALL_EXCEPTION' ? `No USDT founds on thes Network.Please change network to valid chain` : (error?.code) ? `Fail with error error?.code:${error?.code}` : `Fail with error error?.code: ${error}`
                showAlertMessage(mesg)
                const wt = delayed()
                NavigationService.goBack()
            }
        }
        else {
            showAlertMessage('Please enter coin Qty first to continue')
        }
    }
    const depositInToPlatForm = async (data) => {
        await Actions.depositCoins(data).then((res) => {
            console.log('respons deposit amount into wallet : ---', res)
            const msg = res.message ? res.message : res.error
            showAlertMessage(msg, alertType = success)
            setLoading(false);
            NavigationService.goBack()
        }).catch((err) => {
            console.log('error deposit amount into wallet is : ---', err)
            showAlertMessage(err?.error, alertType = danger)
            setLoading(false);
        })
    }

    const transferToOtherPerson = async (data) => {
        await Actions.transactionCoinsToAnotherUser(data).then((res) => {
            console.log('respons transaction Coins To AnotherUser is : ---', res)
            showAlertMessage(res.message, alertType = success)
            setCoinQty('')
            setwalletAddress('')
            setLoading(false);
            const wt = delayed()
            NavigationService.goBack()
        }).catch((err) => {
            console.log('error transaction Coins To AnotherUser is : ---', err)
            showAlertMessage(err?.error, alertType = danger)
            setLoading(false);
        })

    }


    return (
        <>
            <SafeAreaView style={{ ...styles.container, backgroundColor: Colors.app_Bg }}>
                <StatusBar backgroundColor={Colors.app_Bg} barStyle={'dark-content'} />
                <Components.CustomPopUp
                    onHardwareBackPress={closeAlert}
                    onClickTouchOutside={closeAlert}
                    scaleAnimationDialogAlert={showModal}
                    HeaderTitle={lastScreenData?.type}
                    AlertMessageTitle={`Are you want to ${lastScreenData?.type} coins .`}
                    leftBtnText={Titles.Decline}
                    rightBtnText={Titles.Confirm}
                    onPressLeftBtn={closeAlert}
                    onPressRightBtn={onPressConfirm}
                />
                <View style={styles.container}>

                    {/* MARK  : --   Header */}
                    <Components.BackBtnHeader
                        navigation={navigation}
                        isSowText={false}
                        centerheaderTitle={`${lastScreenData?.type} ${lastScreenData?.name}`}//lastScreenData?.name

                    />
                    {/* MARK  : --   inner container */}
                    <View style={styles.innerContainer}>

                        <TextInputVw
                            textStyle={lastScreenData?.type == 'Deposit' && { color: Colors.lightGreyTxt }}
                            headerText={lastScreenData?.type == Titles.Transfer ?`${"Enter user name"}`:`${"Enter wallet address"}`}
                            textValue={walletAddress}
                            placeholder={lastScreenData?.type == Titles.Transfer ? 'john1234' : 'xcd213njj445554....'}
                            editable={(lastScreenData?.type == 'Deposit') ? false : true}
                            onChangeText={setwalletAddress}

                        />
                        <TextInputVw
                            headerText={`${"Enter"} ${lastScreenData?.name}`}
                            bottomText={lastScreenData.type == Titles.Transfer && `${En.Available_Amount} ${selectedCoin?.balance ?? ''} ${(selectedCoin?.symbol ?? ' ').toUpperCase() ?? ''}`}
                            textValue={coinQty}
                            placeholder={`${"Enter"} ${lastScreenData?.name ?? ''} Qty`}
                            keyboardType={'decimal-pad'}
                            onChangeText={(val) => setCoinQty(val)}
                        />

                        <Components.CustomButton title={lastScreenData?.type}
                            containerStyle={styles.customButton}
                            onPress={() => onPressTransfer()} />
                        <View>


                        </View>



                    </View>

                </View>
                {/* <WalletConnectModal
                    projectId={keys.WCProjID}
                    providerMetadata={providerMetadata}
                    sessionParams={sessionParams}
                /> */}
            </SafeAreaView>
            {loading && <Components.CustomLoader />}
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: Colors.app_Bg,
    },
    innerContainer: {
        flex: 1,
        // backgroundColor: Colors.app_Red,
        marginHorizontal: moderateScale(20)
    },
    amountfromWalletContainer: {
        marginTop: moderateScaleVertical(5)
    },
    textInput: {
        marginBottom: moderateScale(0),
        marginTop: moderateScaleVertical(20),
    }, fieldHeader: {
        color: Colors.darkGrayTxt,
        fontSize: textScale(14),
        marginBottom: moderateScale(10),
    }, textInputInnerContainer: {
        backgroundColor: Colors.bg_textfld_dark,
        // paddingVertical: moderateScale(18),
        borderWidth: 1.2,
        borderRadius: 6
    },
    customButton: {
        marginTop: moderateScale(50),
        height: moderateScale(55),
        marginHorizontal: moderateScale(15)
    }, orderDiscript: {
        color: Colors.text_green,
        fontSize: textScale(13),
        marginRight: 0,
        textAlign: 'right',
        marginTop: moderateScale(5)
    },
});

//make this component available to the app
export default Transfer;
