

import { createStackNavigator } from '@react-navigation/stack';
import React from "react";
import Constants from "../Constants/Constants";
import ForgotPassword from "../Screens/Authentication/ForgotPassword";
import Login from "../Screens/Authentication/Login";
import OtpVerify from "../Screens/Authentication/OtpVerify";
import SignUp from "../Screens/Authentication/SignUp";
import CreatePassword from '../Screens/Home/Account/CreatePassword';
import { useSelector } from 'react-redux';
import * as screens from "../Screens/ScreensIndex"

const AuthenticationStack = () => {

  const Stack = createStackNavigator();
  const isSplash = useSelector((state)=>state.auth.userStartApp)
  console.log("AuthenticationStack : --- ",isSplash)

  return (
      <Stack.Navigator screenOptions={{ headerShown: false, }}>
      {/* {(isSplash) && <Stack.Screen name={Constants.splash} component={screens.SplashScreen}  options={{gestureEnabled: false}}/>} */}

      {/* <Stack.Screen name={Constants.splash} component={SplashScreen}  options={{gestureEnabled: false}}/> */}
      <Stack.Screen name={Constants.login} component={Login}/>
      <Stack.Screen name={Constants.forgotPassword} component={ForgotPassword}/>
      <Stack.Screen name={Constants.signUp} component={SignUp} />
      <Stack.Screen name={Constants.TermsConditions} component={screens.TermsConditions} />

      <Stack.Screen name={Constants.createPassword} component={CreatePassword} />
      <Stack.Screen name={Constants.OtpVerify} component={OtpVerify} />
      </Stack.Navigator >

  )
} 
export default AuthenticationStack;