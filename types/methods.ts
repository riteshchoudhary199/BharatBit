import type { ethers } from 'ethers';

export interface FormattedRpcResponse {
  method: string;
  address: string;
  valid: boolean;
  result: string;
  otherData:Object;
  error?: string;
}

export interface FormattedRpcError {
  method: string;
  error?: string;
}

export interface AccountAction {
  method: string;
  callback: (web3Provider?: ethers.providers.Web3Provider) => Promise<any>;
}

export interface RpcRequestParams {
  method: string;
  web3Provider: ethers.providers.Web3Provider;
  address:string;
}

export interface TransactionParams {
  requestPerams:RpcRequestParams;
  fromAddress: string;
  toAddress: ethers.providers.Web3Provider;
  ammaunt:number;
}
