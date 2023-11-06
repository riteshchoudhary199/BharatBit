import React from "react";
import { Text, View, TouchableHighlight } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../Colors/Colors";
const GradientText = ({ colors = [Colors.gradiantUp,Colors.gradiantDwn], onPress, ...rest }) => {
  return (
    <MaskedView maskElement={<Text {...rest} />}>
      <TouchableHighlight onPress={onPress}>
        <LinearGradient colors={colors} >
          <Text {...rest} style={[rest.style, { opacity: 0 }]} />
        </LinearGradient>
      </TouchableHighlight>
    </MaskedView>
  );
};
export default GradientText;