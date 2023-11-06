import { useWalletConnectModal, WalletConnectModal, } from '@walletconnect/modal-react-native';
import { providerMetadata, sessionParams } from '../Constants/walletConfig';
import { ethers } from 'ethers';
import { useMemo } from 'react';



export const walletConnectConfig = () => {
    const { isOpen, open, close, provider, isConnected, address } = useWalletConnectModal();

    const web3Provider = useMemo(
        () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
        [provider],
      );
      // const web3Provider = new ethers.providers.Web3Provider(provider)
    // console.log('web3Provider web3Provider web3Provider : --- ',web3Provider);

    return (
        {isOpen,
        open,
        close,
        provider,
        isConnected,
        address,
        web3Provider,ethers}
    )


}

