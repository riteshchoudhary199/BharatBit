import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { height, moderateScale, verticalScale } from "../Styles/responsiveSize";
import Constants from "../Constants/Constants";
import Colors from "../Colors/Colors";
import CustomTab from "./CustomTab";

const TabBarComponent = ({ state, navigation }) => {
  const [selected, setSelected] = useState(Constants.deals);
  const { routes, index } = state;
  const TabInx = index;
  const renderColor = (currentTab) =>
    currentTab === selected ? Colors.gradiantUp : Colors.blackishGray;

  const handlePress = (activeTab, index) => {
    if (state.index !== index) setSelected(activeTab);
    navigation.navigate(activeTab);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        {routes.map((route, index) => {
          return (
            <View key ={index} style={{flexGrow:1}}>

            <CustomTab
              tab={route}
              icon={route.params.icon}
              onPress={() => handlePress(route.name, index)}
              color={renderColor(route.name)}
              key={route.key}
              activeTabCheck={{ active: TabInx, index: index }}
            />
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // position: "absolute",
    bottom: 0,
    // width: "100%",
    backgroundColor: Colors.bottomBarColor,
    // justifyContent: "center",
  },
  container: {
    justifyContent: "space-around",
    flexDirection: "row",
    // paddingTop:moderateScale(10)
    paddingVertical: moderateScale(10),
  },
});

export default TabBarComponent;
