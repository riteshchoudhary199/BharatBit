
const { ethereum } = require("../../App")


export const connectMetaMaskWallet  = async () =>{
    return new Promise((resolve,reject)=>{
        ethereum.request({ method: 'eth_requestAccounts' }).then((res)=>{
            console.log('res from eterium connect :----   ',res)
            resolve(res)
            // setAccounts(res)
          }).catch((err)=>{
            console.log('error from eterium connect :----   ',err)
            reject(err)
          })
    })
}

export const makeMetamaskTransaction = (params) => {
    return new Promise((resolve,reject)=>{
     ethereum.request({
            method: 'eth_sendTransaction',
            params: [params]
        }).then(res => {
            console.log('response>>>', res)
            resolve(res)
        })
        .catch(err => {
            console.log('error from provider is : -- ', err)
            reject(err)
        })
    })

}
export const connectWalletConnect = () =>{
    return new Promise((resolve,reject)=>{
        ethereum.request({ method: 'eth_requestAccounts' }).then((res)=>{
            console.log('res from eterium connect :----   ',res)
            resolve(res)
            // setAccounts(res)
          }).catch((err)=>{
            console.log('error from eterium connect :----   ',err)
            reject(err)
          })
    })
}