//import liraries
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarComponent from '../Components/TabBarComponent';
import Deals from '../Screens/Home/Deals';
import Sells from '../Screens/Home/Sells';
import Trades from '../Screens/Home/Trades/Trades';
import Dashboard from '../Screens/Home/Dashboard/Dashboard';
import Constants from '../Constants/Constants';
import ImagePath from '../Constants/ImagePath';

import Chat from '../Screens/Home/Trades/Chat';
import { useSelector } from 'react-redux';
import * as screens from "../Screens/ScreensIndex"
import { View } from 'react-native';
import { height } from '../Styles/responsiveSize';


const Tab = createBottomTabNavigator();

// create a component
const TabNavigator = () => {

    return (
        // <View style={{height:height}}>
        <Tab.Navigator
            screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true, tabBarStyle: { position: 'absolute' }, }} tabBar={(props) => <TabBarComponent {...props} />}>

            <Tab.Screen options={{ tabBarHideOnKeyboard: true, unmountOnBlur: true, tabBarBadge: 5 }} name={Constants.deals} component={Deals} initialParams={{ icon: ImagePath.dealsIcon }} />
            <Tab.Screen options={{ tabBarHideOnKeyboard: true, unmountOnBlur: true }} name={Constants.sells} component={Sells} initialParams={{ icon: ImagePath.walletIcon }} />
            {/* <Tab.Screen name={Constants.chat} component={Chat} initialParams={{icon: ImagePath.tradesIcon}} /> */}

            <Tab.Screen options={{ tabBarHideOnKeyboard: true, unmountOnBlur: true }} name={Constants.trades} component={Trades} initialParams={{ icon: ImagePath.tradesIcon }} />

            <Tab.Screen options={{ tabBarHideOnKeyboard: true, unmountOnBlur: true }} name={Constants.wallet} component={Dashboard} initialParams={{ icon: ImagePath.dashboardIcon }} />
            <Tab.Screen options={{ tabBarHideOnKeyboard: true, unmountOnBlur: true }} name={Constants.account} component={screens.Account} initialParams={{ icon: ImagePath.userIcon }} />

            {/* <Tab.Screen name={Constants.account} component={Account} initialParams={{icon:ImagePath.userIcon}}/> */}
            {/* <Tab.Screen name={Constants.account} component={EditProfile} initialParams={{icon:ImagePath.userIcon}}/> */}
        </Tab.Navigator>
        //  </View>
    );

};


//make this component available to the app
export default TabNavigator;


