import { StyleSheet } from "react-native";
import { AppFonts, ImageEnum } from "../Constants";
import Colors from "../Colors/Colors";
import { moderateScale, scale, textScale } from "./responsiveSize";

export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow: {
    // backgroundColor: 'white',
    // shadowColor: Colors.shadow_LightBlack,
    // shadowRadius: 3,
    // shadowOpacity: 0.6,
    // borderRadius: 8,
    // shadowOffset: { height: 4, width: 0 },
    backgroundColor: 'white',
    shadowColor: Colors.shadow_LightBlack,
    shadowRadius: 3,
    shadowOpacity: 0.44,
    borderRadius: 8,
    shadowOffset: { height: 1.2, width: 0 },
    elevation:6
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '800',
    fontSize: 30,
    textAlign: 'center',
    color: 'blue',
    // fontFamily: 'Cochin',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    color: Colors.text_Black,
    fontSize: textScale(16),
    fontFamily: AppFonts.regular,
    textAlignVertical:'center'
  },
  textInputImg: {
    borderRadius: 0, alignSelf: 'center',
    resizeMode: ImageEnum.contain,
    height: scale(20),
    width: scale(20)
  },
  textfieldContainer: {
    backgroundColor: Colors.bg_textfld, flexDirection: 'row',
    borderRadius: 10,
    borderColor: Colors.border_textfld_dark, borderWidth: 1.5,
    paddingHorizontal: moderateScale(10),
    // paddingVertical: moderateScale(0),
    height: moderateScale(54),
    // justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 10,
    height: 50,
    overflow: 'hidden'
  },
  tabIconStyle: {
    alignSelf: 'center',
    height: scale(22),
    width: scale(22),
    resizeMode: ImageEnum.contain
  },
  centerAlignedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImgStyle: {
    height: scale(110),
    width: scale(110),
    resizeMode: ImageEnum.contain
  },
  smallLogoImgStyle: {
    height: scale(30),
    width: scale(30),
    resizeMode: ImageEnum.contain,
  },
  tabBarLabelStyle: {
    marginTop: moderateScale(4),
    justifyContent: 'center'
  }
});

export const TextStyles = StyleSheet.create({
  extraBold: {
    fontFamily: AppFonts.bold,
    fontSize: textScale(28),
    padding: 5,
    color: Colors.text_Black,
  },
  large: {
    fontFamily: AppFonts.bold,
    fontSize: textScale(20),
    color: Colors.text_Black,
  },

  medium: {
    fontFamily: AppFonts.medium,
    fontSize: textScale(18),
    color: Colors.text_Black,
  },
  bold: {
    fontFamily: AppFonts.bold,
    fontSize: textScale(25),
    // padding: 5,
    color: Colors.text_Black,
  },
  semibold: {
    fontFamily: AppFonts.bold,
    fontSize: textScale(16),
    // padding: 5,
    color: Colors.text_Black,
  },
  small: {
    fontFamily: AppFonts.semibold,
    fontSize: textScale(14),
    color: Colors.text_tunaBlack,
  },
  regularMedium: {
    fontFamily: AppFonts.medium,
    fontSize: textScale(12),
  },
  regular: {
    fontFamily: AppFonts.regular,
    fontSize: textScale(15),
  },
  btnTitle: {
    color: Colors.text_White, fontFamily: AppFonts.medium,
    fontSize: textScale(20),
  }, errorText: {
    fontSize: textScale(12),
    fontFamily: AppFonts.regular,
    marginBottom: moderateScale(15),
    color: Colors.error_Red,
  },
  alertText: {
    fontSize: textScale(14),
    fontFamily: AppFonts.medium
  }
})
