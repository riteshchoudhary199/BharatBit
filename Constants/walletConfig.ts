import {IProviderMetadata} from '@walletconnect/modal-react-native';

export const providerMetadata: IProviderMetadata = {
  name: 'React Native V2 dApp',
  description: 'RN dApp by WalletConnect',
  url: 'https://walletconnect.com/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'w3msample://',
  },
};

export const sessionParams = {
  namespaces: {
    eip155: {
      methods: [
        // 'personal_sign',
        'eth_sign',
        'eth_signTypedData',
        'eth_sendTransaction',
      ],
      chains: ['eip155:1'],
      events: ['chainChanged', 'accountsChanged'],
      rpcMap: {},
    },
  },
};