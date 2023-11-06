import React from 'react'
import AuthenticationStack from '../NavigationStacks/AuthenticationStack';
import { useSelector } from 'react-redux';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import TabNavigator from '../NavigationStacks/TabNavigator';
// import NavigationService from '../Services/NavigationService';
import MainStack from './MainStack';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../Screens/Authentication/SplashScreen';
import { Constants } from '../Constants';
import NavigationService from '../Services/NavigationService';


function RootScreen (props) {

    const {userLoginStatus,} = useSelector((state)=>state.auth)
    const isSplash = useSelector((state)=>state.auth.userStartApp)
    console.log(userLoginStatus,'userLoginStatus?????>>>>')
    const Stack = createStackNavigator();

        console.log('user id is =--------   ',userLoginStatus?._id)
    return (

        <NavigationContainer ref={(navigationRef) => {
            NavigationService.setTopLevelNavigator(navigationRef);
        }}

        >
        {/* <Stack.Screen name={Constants.splash} component={SplashScreen}  options={{gestureEnabled: false}}/> */}
        {(userLoginStatus?.token) ? <>{MainStack()}</> : <>{AuthenticationStack()}</>}
        {/* {userLoginStatus?.token ? <>{MainStack()}</> : <>{AuthenticationStack()}</>} */}
      </NavigationContainer>


    );

}
export default RootScreen;
