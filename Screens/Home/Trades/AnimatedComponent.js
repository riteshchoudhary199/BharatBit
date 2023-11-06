// import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
// import FlashMessage from 'react-native-flash-message';
// import { Provider } from 'react-redux';
// import Routes from "./src/Navigation/Routes";
// import actions from './src/redux/actions';
// import { saveUserData } from './src/redux/reducers/auth';
// import store from './src/redux/store';
// import fontFamily from './src/styles/fontFamily';
// import { moderateScale, textScale, width } from './src/styles/responsiveSize';

// import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import './shim';
// import { PossesionsComponent } from './src/Screens/Dashboard/Dashboard';
// import colors from './src/styles/colors';
// import commonStyles from './src/styles/commonStyles';
// const { dispatch } = store;
// const tabs = [
//     {
//         id: 1,
//         name:"All Properties",
//     },
//     {
//         id: 2,
//         name:"Possessions",
//     },
// ]

// const propertiesTab = tabs.map((propertiesTab) => ({
//   ...propertiesTab,
//   ref: createRef()

// }))
// const dummyPropertiesData = [
//   {
//     id: 1,
//     name: "Hexagon villa"
//   },
//   {
//     id: 2,
//     name: "Hexagon villa"
//   },
//   {
//     id: 3,
//     name: "Hexagon villa"
//   },
//   {
//     id: 4,
//     name: "Hexagon villa"
//   },
// ]
// const dummyPossesionsData = [
//   {
//     id: 1,
//     name: "Hexagon villa"
//   },
//   {
//     id: 2,
//     name: "Hexagon villa"
//   },
//   {
//     id: 3,
//     name: "Hexagon villa"
//   },

// ]

// const AnimatedComponent = () => {
//   const [changeTab, setSetChangeTab] = useState(false)

// //   const init = async () => {
// //     try {
// //       const userData = await getUserData();
// //       const isFirstTime = await getFirstTime();
// //       if (userData && !!userData.token) {
// //         console.log("enter")
// //         dispatch(saveUserData(userData));
// //       }
// //       if (!!isFirstTime) {
// //         actions.isFirstTime(true)
// //       }
// //       console.log('is first time app', isFirstTime)
// //     } catch (error) {
// //       console.log(error)
// //     }
// //   }

//   useEffect(() => {
//     init()
//   }, []);

//   const scrollX = useRef(new Animated.Value(0)).current;
//   const propertiesTabScrollViewRed = useRef()
//   const onPropertyTabPress = useCallback(propertyTabIndex => {
//     propertiesTabScrollViewRed?.current?.scrollToOffset({
//       offset: propertyTabIndex * width,
//     })
//     if (propertyTabIndex) {
//       setSetChangeTab(!changeTab)
//     }
//     console.log(changeTab, 'this is change tab')

//   }, [])
//   const TabIndicator = ({ scrollX, measureLayout }) => {
//     const inputRange = propertiesTab.map((_, i) => i * width)
//     const translateX = scrollX.interpolate({
//       inputRange,
//       outputRange: measureLayout.map(measure => measure.x)
//     })
//     return (
//       <Animated.View
//         style={{
//           position: 'absolute',
//           left: 0,
//           height: "100%",
//           width: (width - (10 * 2)) / 2.2,
//           // borderRadius: 24,
//           // borderTopRightRadius: 20,
//           backgroundColor: colors.theme,
//           transform: [{
//             translateX
//           }]
//         }}
//       />
//     )
//   }
//   const Tabs = ({ scrollX, onPropertyTabPress }) => {
//     const [measureLayout, setMeasureLyout] = useState([])
//     const containerRef = useRef()

//     useEffect(() => {
//       let ml = []
//       propertiesTab.forEach(propertyTab => {
//         propertyTab?.ref?.current?.measureLayout(
//           containerRef.current,
//           (x, y, width, height) => {
//             ml.push({
//               x, y, width, height
//             })
//             if (ml.length === propertiesTab.length) {
//               setMeasureLyout(ml)
//               console.log(ml, 'this is ml')
//             }
//           }
//         )
//       })
//     }, [containerRef.current])
//     return (
//       <View
//         ref={containerRef}
//         style={{ flexDirection: 'row' }}>
//         {/* Tab Indicator */}
//         {measureLayout.length > 0 &&
//           <TabIndicator
//             measureLayout={measureLayout}
//             scrollX={scrollX}
//           />
//         }
//         {/* Tabs */}
//         {propertiesTab.map((item, index) => {
//           // tabIndex = index
//           return (
//             <TouchableOpacity
//               onPress={() => onPropertyTabPress(index)}
//               key={`PropertyTab-${index}`}
//               style={{ flex: 1 }}
//             >
//               <View
//                 ref={item.ref}
//                 style={styles.tabTouchable}
//               >
//                 <Text style={{ ...styles.tabLable }}>{item?.name}</Text>
//               </View>
//             </TouchableOpacity>
//           )
//         })}
//       </View>
//     )
//   }
//   const renderTabBar = useCallback(() => {
//     return (
//       <View style={styles.renderTabBar}>
//         <Tabs
//           scrollX={scrollX}
//           onPropertyTabPress={onPropertyTabPress}
//         />
//       </View>
//     )
//   }, [])



//   const renderItem = useCallback(({ item, index }) => {
//     return (
//       <View style={{
//         alignItems: 'center',
//         flex: 1,
//         width: width
//       }}>
//         <FlatList
//           // contentContainerStyle={{alignItems: 'center'}}
//           // data={changeTab?dummyPossesionsData:dummyPropertiesData}
//           data={index === 0 ? dummyPropertiesData : dummyPossesionsData || []}
//           // ListHeaderComponent={ListHeaderComponent}
//           renderItem={({ item, index }) =>
//             <PossesionsComponent
//               item={item}
//               style={{
//                 marginTop: moderateScale(5),
//                 marginHorizontal: moderateScale(5),
//               }}
//             />
//           }
//           numColumns={2}
//           ItemSeparatorComponent={() => <View style={{ width: moderateScale(10) }} />}
//         />

//       </View>
//     )
//   }, [])

//   const renderList = useCallback(() => {
//     return (
//       <Animated.FlatList
//         ref={propertiesTabScrollViewRed}
//         data={propertiesTab}
//         contentContainerStyle={{
//           // marginTop: 24,
//         }}
//         horizontal
//         pagingEnabled
//         scrollEventThrottle={16}
//         snapToAlignment='center'
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={item => item.id}
//         onScroll={
//           Animated.event([
//             { nativeEvent: { contentOffset: { x: scrollX } } }
//           ], {
//             useNativeDriver: false
//           })
//         }
//         renderItem={renderItem}
//       />
//     )
//   }, [])


//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <Routes />
//         <FlashMessage
//           titleStyle={{
//             marginRight: moderateScale(5),
//             fontFamily: fontFamily.medium,
//             fontSize: textScale(16)
//           }}
//           position="top"
//         />
//       </SafeAreaProvider>
//     </Provider>
//     // <SafeAreaView style={{
//     //   flex: 1,
//     //   backgroundColor: colors.white
//     // }}>
//     //   {renderTabBar()}

//     //   <View style={{
//     //     marginTop: moderateScale(40),
//     //     flex: 1
//     //   }}>
//     //     {renderList()}

//     //   </View>

//     // </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   renderTabBar: {
//     ...commonStyles.shadowStyle,
//     width: moderateScale(300),
//     marginTop: 12,
//     marginHorizontal: 12,
//     borderRadius: 20,
//     backgroundColor: colors.appGray,
//     alignSelf: 'center',
//     overflow: 'hidden',
//   },
//   tabTouchable: {
//     paddingHorizontal: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 40
//   },
//   tabLable: {
//     ...commonStyles.regular15,
//     // color: colors.black,

//   },
// })


// export default AnimatedComponent;