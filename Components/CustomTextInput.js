//import liraries
import React, { Component, isValidElement, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';
import ImagePath from '../Constants/ImagePath';
import Colors from '../Colors/Colors';
import { CommonStyles,TextStyles } from '../Styles/ComnStyle';
import { moderateScale } from '../Styles/responsiveSize';
// create a component
const CustomTextInput = ({
  textStyle,
  containerStyle,
  innerContainerStyle,
  placeholder,
  value,
  maxLength,
  defaultSecure = false,
  onChangeText = () => { },
  leftImage, keyboardType,
  returnKeyType = 'done',
  imageEyeOpen = ImagePath.eyeOpen,
  imageEyeClose = ImagePath.eyeClose,
  isshowLeftImg = true,
  isTogleSecure = true,
  editable = true,
  isShowRightImage = false,
  rightImage,
  rightImageAction,
  rightText,
  rightTextStyle,
  leftText,
  leftTextStyle,
  onBlur=()=>{},
  onFocus =()=>{},
  secureTextEntry,
  
}) => {

  const [secured, setSecured] = useState(defaultSecure)

  const secure = secureTextEntry || secured === true
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <View>
        <View style={{ ...CommonStyles.textfieldContainer, ...innerContainerStyle, }}>
          {isshowLeftImg &&
            <Image style={CommonStyles.textInputImg} source={leftImage}></Image>
          }
          {(leftText) &&
          <View style={{paddingLeft:moderateScale(8),marginBottom:4}}>
            <Text
          style={{...TextStyles.medium,...textStyle,...leftTextStyle,textAlignVertical:'top',}}>{leftText}</Text>
            </View>
          }
          {secureTextEntry ? <TextInput
           
            style={{ ...CommonStyles.textInput, ...textStyle }} maxLength={maxLength}
            placeholder={placeholder} value={value}
            placeholderTextColor={Colors.placeholder}
            returnKeyType={returnKeyType}
            secureTextEntry={secured}
            onChangeText={onChangeText}
            editable={editable}
            onFocus={onFocus}
            onBlur={onBlur}


          // selectTextOnFocus={true}
          /> : <TextInput
            
            style={{ ...CommonStyles.textInput, ...textStyle ,height:'100%'}} maxLength={maxLength}
            placeholder={placeholder} value={value}
            placeholderTextColor={Colors.placeholder}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            secureTextEntry={secured}
            onChangeText={onChangeText}
            editable={editable}
            onFocus={onFocus}
            onBlur={onBlur}
          // selectTextOnFocus={true}
          />}

          {secureTextEntry === true &&
            <TouchableOpacity
              onPress={() => {
                setSecured(!secured)
                console.log('secured=====', secured)
              }}


            >
              {isTogleSecure &&
                <Image
                  style={{ ...CommonStyles.textInputImg }}
                  source={!secured ? imageEyeOpen : imageEyeClose} >
                </Image>
              }
            </TouchableOpacity>
          }
          {(rightText) &&
            <Text
            style={{...TextStyles.medium,flex:0,textAlign:'center',borderLeftWidth:1.2,
            borderLeftColor:Colors.border_textfld_dark,textAlignVertical:'center',paddingLeft:moderateScale(15),
            paddingRight:moderateScale(8), ...textStyle,...rightTextStyle }}>{rightText}</Text>
          }
          {isShowRightImage &&
            <TouchableOpacity
              onPress={() => rightImageAction}
            >
              <Image
                style={{ ...CommonStyles.textInputImg }}
                source={rightImage}
              >
              </Image>
            </TouchableOpacity>
          }

        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // marginHorizontal: 15,
  },
});

//make this component available to the app
export default CustomTextInput;
