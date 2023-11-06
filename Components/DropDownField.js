//import liraries
import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import ImagePath from '../Constants/ImagePath';
import AppFonts from '../Constants/AppFonts';
import Colors from '../Colors/Colors';
import { CommonStyles, TextStyles } from '../Styles/ComnStyle';
import { scale } from '../Styles/responsiveSize';
// const data = [
//   { label: 'Item 1', value: '1' },
//   { label: 'Item 2', value: '2' },
//   { label: 'Item 3', value: '3' },
//   { label: 'Item 4', value: '4' },
//   { label: 'Item 5', value: '5' },
//   { label: 'Item 6', value: '6' },
//   { label: 'Item 7', value: '7' },
//   { label: 'Item 8', value: '8' },
// ];

// create a component
const DropDownField = ({
  data = { title: 'Item 1', _id: '1' },
  defaultValue,
  labelHeaderText,
  headerTextStyle,
  placeholderText,
  containerStyle,
  dropdownStyle,
  isSearch = true,
  onSelecton = () => { }
}) => {

  const [value, setValue] = useState('');
  useEffect(React.useCallback(() => {
    setValue(defaultValue)
  }, [defaultValue]
  ));
  const renderItem = item => {
    return (
      <View style={{ ...styles.item, backgroundColor: item?._id === value?._id ? Colors.app_Bg : Colors.app_White }}>
        <Image source={item?.Image} />
        <Text style={{ ...styles.textItem, color: Colors.text_Black }}>{item?.title}</Text>
        {item?._id === value?._id && (
          <Image source={ImagePath.chek} />
        )}
      </View>
    );
  };
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      {
        labelHeaderText &&
        <Text style={{ ...TextStyles.medium, ...styles.labelHeader, ...headerTextStyle }}>
          {labelHeaderText}
        </Text>
      }

      <Dropdown
        style={{ ...styles.dropdown, ...dropdownStyle }}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={isSearch}
        maxHeight={300}
        labelField="title"
        valueField="title"
        placeholder={placeholderText}
        searchPlaceholder="Search..."
        value={value}
        renderRightIcon={() => (
          <Image source={ImagePath.arrowDwn}
            resizeMode='contain'
            style={{ height: scale(40), width: scale(18), }}
          />
        )
        }
        onChange={item => {
          onSelecton(item)
          setValue(item);
          console.log('selected item is:--', item)
        }}
        // renderLeftIcon={() => (
        //     // <Image source={ImagePath.arrowDwn}/>
        //     // <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        // )}
        renderItem={renderItem}
      />
    </View>
  );
};

// define your styles


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.app_White

  },
  labelHeader: {
    marginBottom: 10,
    color: Colors.darkGrayTxt,

  },

  dropdown: {
    // margin: 16,
    height: 50,
    backgroundColor: Colors.app_White,
    // backgroundColor: Colors.bg_textfld_dark,
    borderRadius: 8,
    paddingHorizontal: 10,
    // padding: 12,
    borderColor: Colors.border_textfld_dark,
    borderWidth: 1.2,
    // elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    fontFamily: AppFonts.medium,
    marginLeft: 15,
    // color:Colors.text_Black,
  },
  placeholderStyle: {
    fontSize: 16,
    // fontFamily:AppFonts.medium
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.text_Black
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
//make this component available to the app
export default DropDownField;
