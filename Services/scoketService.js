import { Component } from "react";
import { io } from "socket.io-client";


class WSService {

    initializeSocket = (socketUrl) => {

        // return new Promise(async (resolve, reject) => {
        //     apiPost(FORGOT_PASS, data, {}).then((res) => {
        //       // dispatch(login(res?.data));
        //       resolve(res)
        //     }).catch((error) => {
        //       reject(error)
        //     })
        //   })




        this.socket = io(socketUrl, {
            // transports: ['websocket'],
        });
        // console.log('initializing socket', this.socket);

        //  this.socket.on('connect', (data) => {
        //         console.log('===== socket connected =====');
        //         return 'connected'

        //     });

        // this.socket.on('disconnect', async () => {
        //     console.log('socket disconnected', this.socket);
        //     // await socketReconnect()
        // });

        this.socket.on('destroy', async () => {
            console.log('socket destroy', this.socket);
            // await socketReconnect()
        });

        this.socket.on('socketError', (err) => {
            console.log('socket connection error: ', err);
            // logger.data('socket connection error: ', err);
        });
        this.socket.on("parameterError", () => {
            console.log('socket connection error: ', err);
        })
        this.socket.on('error', (error) => {
            console.log(error, 'thea data');
        });


    };

    emit(event, data = {}) {
        this.socket.emit(event, data);

    }

    async emitWithAck(event, data = {}) {
        return (
            await this.socket.emitWithAck(event, data)
        )
    }

    on(event, cb) {
        this.socket.on(event, cb);
    }


    removeListener(listenerName) {
        this.socket.removeListener(listenerName);
    }

    addEventListener(listenerName) {
        this.socket.addEventListener(listenerName);
    }

    disconnectSocket() {
        this.socket.disconnect();
    }

    destroySocket() {
        this.socket.destroy();
    }
    hasListeners() {
        return this.socket.hasListeners()
    }

}

// export const socketReconnect = async () => {
//     const userDetails =
//         setTimeout(async () => {
//             socketServices.socket.on('connect', (data) => {
//                 console.log('===== socket connected =====');
//             });
//             userOnline()
//         }, 100);

// }
// export const userOnline = async () => {
//     const userDetails = useSelector((state) => state?.auth?.userLoginStatus)
//     // setTimeout(async () => {
//         if (userDetails) {
//             socketServices.emit('online', { 'userId': userDetails?._id })
//             console.log('socketServices emit to online', userDetails?._id)
//         }
//         console.log('socketServices emit to online', userDetails)
//     // }, 2000);
// }

const socketServices = new WSService();

export default socketServices;