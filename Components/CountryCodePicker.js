
import { StyleSheet, View, Image, } from "react-native"
import CountryPicker from "react-native-country-picker-modal";
import { height, moderateScale, width } from "../Styles/responsiveSize";
import { ImagePath, Localize } from "../Constants/index";
function CountryCodePicker({
  countryFlag = "IN",
  onSelect,
  withCountryName = false,
  downArrowStyle = {},
  withCurrencyButton = false,
  isShowRightArrow = true,
  pointerEvents
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center',}
    }
    pointerEvents={pointerEvents}
    >
      <CountryPicker
        onSelect={onSelect}
        visible={false}
        countryCode={countryFlag}
        withCallingCode={true}
        containerButtonStyle={isShowRightArrow ? { marginLeft: -3,paddingVertical:0} : { marginLeft: 0, paddingHorizontal: 0, }}
        // renderFlagButton={containerButtonStyle: {}}
        // withCallingCodeButton={countryCode}
        withEmoji={false}
        theme={
          {
            //  onBackgroundTextColor: Colors.black,
          }
        }
        withFilter={true}
        withCountryNameButton={withCountryName}
        withCurrencyButton={withCurrencyButton}
      />
      {
        isShowRightArrow &&
        <Image
          source={ImagePath.arrowDwn}
          style={{
            height: moderateScale(height / 25),
            width: moderateScale(width / 25),
            resizeMode: "contain",
            marginLeft: moderateScale(-4),
            // paddingVertical: moderateScale(10),
            ...downArrowStyle,
          }}
        />
      }

    </View>
  );
}
const style = StyleSheet.create({

});

export default CountryCodePicker;
