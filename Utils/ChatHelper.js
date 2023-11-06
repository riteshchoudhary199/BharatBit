const { IMAGE_URl } = require("../Constants/Urls")

export const appendNewMessageInChatList = (messageData,userDetail)=>{

// const =  {"result": {"_id": "64f9d4157b152f1f46244f05", "chatExchangeId": "64f7204158e4b6c2780f25b7",
//  "createdAt": "2023-09-07T13:45:57.340Z", "isDefault": false, "isSeen": false,
//   "message_type": "", "offerId": "64f6f8e76f6f37816632acde", "pdfImage": "m4g3aps61spdf.png",
//    "receiver": "64f06c3a42a5bec1877063ce", "sender": "64f06d3542a5bec187706439", 
//    "text": "Hkjhfgh", "updatedAt": "2023-09-07T13:45:57.340Z"}}
     const systmMsg = messageData?.message_type

     const extension = messageData?.file?.split('.').pop();
     const fileUrl = messageData?.file ? IMAGE_URl + messageData?.file : ''
     const isPdf = extension === 'pdf'

        let mess = [
            {
                //  "_id": mapData?._id,
                _id: messageData?._id,
                createdAt: messageData?.createdAt,
                text: messageData?.text,
                isDefault: messageData?.isDefault,
                system: (systmMsg && systmMsg !== ''),
                message_type: systmMsg,
                user: {
                    _id: messageData?.sender,
                    avatar: IMAGE_URl + userDetail?.profilePic,
                    name: `${userDetail?.firstName} ${userDetail?.lastName}`
                },
                image: !isPdf ? fileUrl : '',
                file: {
                    url: isPdf ? fileUrl : ''
                },
                // sent: true,
                // received : true,
                // seen: messageData?.isSeen
            }
        ]
    // console.log('appendNewMessageInChatList : --',mess);
        return mess
}

export const appendNewMessageInChatListLocally = (messageData,files,userDetail)=>{
         const systmMsg = messageData?.message_type  
         const extension = messageData?.file?.split('.').pop();
         var randomNumber = Math.floor(Math.random() * 1000000) + 1;

            let mess = [
                {
                    //  _id: randomNumber,
                    _id: messageData?._id,
                    createdAt: new Date(),
                    text: messageData?.text,
                    isDefault: messageData?.isDefault,
                    system: (systmMsg && systmMsg !== ''),
                    message_type: systmMsg,
                    user: {
                        _id: userDetail?._id,
                        avatar: IMAGE_URl + userDetail?.profilePic,
                        name: `${userDetail?.firstName} ${userDetail?.lastName}`
                    },
                    image: files?.image,
                    file: {
                        url: files?.filePath
                    },
                    // sent: true,
                    // received : true,
                    // seen: messageData?.isSeen
                }
            ]
        
            return mess
    }