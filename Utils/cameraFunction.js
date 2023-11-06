import { Alert, Platform } from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { androidCameraPermission, checkCameraAndGallaryPermision } from "./permissions";
import { showAlertMessage } from "./helperFunctions";

// ----------LAUNCH CAMERA and gallery--------
export const selectImageOptions = (setValue) => {
  console.log (setValue);
  Alert.alert("Upload Image", "Choose an option", [
    {
      text: "Camera",
      onPress: () => openCamera(setValue),
    },
    {
      text: "Gallery",
      onPress: () => openGallery(setValue),
    },
    {
      text: "Cancel",
      // onPress: () => console.log("OK Pressed"),
      style: "cancel",
    },
  ]);
};
export const openGallery = async (ongettingImage = () => {}, setValue) => {
//   const validate = await androidCameraPermission()
//   if (!validate){
// showAlertMessage('Please enable camera permissions')
// return
//   }
  // checkCameraAndGallaryPermision()


try {
const options = {
  storageOptions: {
      path: "images",
      mediaType: "photo"
  },
  includeBase64: false
}
const result = await launchImageLibrary(options)
const source = { uri: result.assets[0] }
console.log(source)
ongettingImage(setValue, source);

} catch (error) {
console.log("error gallery picture",error)
}

 
}
const openCamera = async (ongettingImage = () => {}, setValue) => {
  const options = {
      storageOptions: {
          path: "images",
          mediaType: "photo"
      },
      includeBase64: false
  }
  const result = await launchCamera(options)
  console.log(result)
  const source = { uri: result.assets[0] }
  ongettingImage(setValue, source);
  // setThumbnail(source)
  console.log(source)
}
