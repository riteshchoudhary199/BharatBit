import { useState } from "react";
import * as DocumentPicker from 'react-native-document-picker';

export  async function documentPicker(){
    try {
        const result = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf,DocumentPicker.types.images,DocumentPicker.types.video],
            copyTo: 'documentDirectory',
            mode: 'import',
            allowMultiSelection: false,
        });
        const fileUri = result[0].fileCopyUri;
        if (!fileUri) {
            console.log('File URI is undefined or null');
            return {};
        }
        if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
            console.log('selected file is setIsAttachImage', fileUri)
return{
    fileData:result[0],
    uri:fileUri,
    type:'image',
    cancel:undefined,
    error:undefined
}
        } else {
            console.log('selected file is setIsAttachFile', fileUri)
            return{
                fileData:result[0],
                uri:fileUri,
                type:'file',
                cancel:undefined,
                error:undefined
            }
        }
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled file picker');
            return{
                fileData:undefined,
                uri:undefined,
                type:undefined,
                cancel:true,
                error:err
            }
        } else {
            console.log('DocumentPicker err => ', err);
            throw err;
        }
    }
};
