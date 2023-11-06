import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
// import Pdf from 'react-native-pdf';
import { IMAGE_URl } from '../../Constants/Urls';
import { WebView } from 'react-native-webview'; 
// import PDFView from 'react-native-view-pdf';
import Pdf from 'react-native-pdf';
import { Colors } from '../../Constants';
// import PDFView from 'react-native-view-pdf/lib/index';

function InChatViewFile({props, visible, onClose=()=>{}}) {

  const [showModal,setShowModal] = useState(false)
  // console.log("currentfile  url is : --",props)

  const source = { uri: props, cache: true };

  // useEffect(()=>{
  //   setShowModal(visible)
  // },[visible])
  return (
    <Modal
      visible={visible}
      onRequestClose={()=>onClose()}
      animationType="slide"
      style={{height: 600}}
    >
        <Pressable 
         android_ripple={{color:Colors.selectedBg,borderless:true}}
         style={styles.buttonCancel}
         onPress={()=>onClose()}>

         <Text style={styles.textBtn}>X</Text>
        </Pressable>
      <View style={{paddingHorizontal:0,flex:1}}>
        {/* <View style={{flex:1,}}> */}
      
        <Pdf
                    source={source}
                    trustAllCerts={false}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                        console.log(`filePath of pages: ${filePath}`);

                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                        console.log(`numberOfPages page: ${numberOfPages}`);

                    }}
                    onError={(error) => {
                        console.log('error while loading pdf is :--- ',error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={{flex:1,}}/>       
        

      </View>
    
    </Modal>
  );
}
export default InChatViewFile;
const styles = StyleSheet.create({
  buttonCancel: {
    width: 35,
    height: 35,
    backgroundColor:'red',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 13,
    top: 20,
    zIndex:999
  },
  textBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});