import { ethers } from 'ethers';
import { numberToHex, sanitizeHex, utf8ToHex } from '@walletconnect/encoding';

import type { FormattedRpcResponse, RpcRequestParams, TransactionParams } from '../types/methods';
import { keys } from '../Constants/Privates';

export const readContract = async ({web3Provider,method,address}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }
  const signer = await web3Provider.getSigner();
  const contract = new ethers.Contract(
    keys.USDT_TOKEN_ADDRESS,
    keys.USDT_ABI_JSON,
    signer
  );

  // Read contract information
  const name = await contract.name();
  console.log("name is : ----",name)
  const symbol = await contract.symbol();
  console.log("symbol is : ----",symbol)
  const balance = await contract.balanceOf(address);
  console.log("balance is : ----",balance)
  // Format the USDT for displaying to the user
  const formattedBalance = ethers.utils.formatUnits(balance, 6);
console.log("formattedBalance is : ----",formattedBalance)

  return {
    method,
    address: keys.USDT_TOKEN_ADDRESS,
    valid: true,
    otherData:{contractName:name,balance:formattedBalance,contract:contract},
    result: `name: ${name}, symbol: ${symbol}, balance: ${formattedBalance}`,
  };
};

export const sendTransaction = async ({requestPerams,fromAddress,toAddress,ammaunt}: (TransactionParams)): Promise<FormattedRpcResponse> => {
  if (!requestPerams.web3Provider) {
    throw new Error('web3Provider not connected');
  }

  // Get the signer from the UniversalProvider
  const signer = requestPerams.web3Provider.getSigner();
  const [address] = await requestPerams.web3Provider.listAccounts();

  if (!address) {
    throw new Error('No address found');
  }

  const amount = sanitizeHex(numberToHex(ammaunt));

  const transaction = {
    from: address,
    to: toAddress,
    value: amount,
    data: '0x',
  };

  // Send the transaction using the signer
  const txResponse = await signer.sendTransaction(transaction);

  const transactionHash = txResponse.hash;
  console.log('transactionHash is ' + transactionHash);

  // Wait for the transaction to be mined (optional)
  const receipt = await txResponse.wait();
  console.log('Transaction was mined in block:', receipt.blockNumber);
const method = 'send trnansaction'
  return {
    method,
    address,
    valid: true,
    result: transactionHash,
    otherData:{txResponse:txResponse,transactionHash:transactionHash,receipt:receipt},
  };
};


export const getFilterChanges = async ({
  web3Provider,
  method,
}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }

  const contract = new ethers.Contract(
    keys.USDT_TOKEN_ADDRESS,
    keys.getFilterChangesAbi,
    web3Provider
  );

  // Filter for all token transfers
  const filterFrom = contract.filters.Transfer?.(null, null);

  // List all transfers sent in the last 100 blocks
  const transfers = await contract.queryFilter(filterFrom!, -100);

  return {
    method,
    otherData:{filterFrom:filterFrom,transfers:transfers},
    address: keys.USDT_TOKEN_ADDRESS,
    valid: true,
    result: `transfers in last 100 blocks: ${transfers.length}`,
  };
};

