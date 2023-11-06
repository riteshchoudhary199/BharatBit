

import React from "react";
import { createStackNavigator,CardStyleInterpolators } from '@react-navigation/stack';
import { Constants } from "../Constants";
import TabNavigator from "./TabNavigator";
import * as screens from "../Screens/ScreensIndex"
import { useSelector } from "react-redux";

const MainStack = () => {
    const Stack = createStackNavigator();
    const isSplash = useSelector((state)=>state.auth.userStartApp)
    return (
        <Stack.Navigator screenOptions={{ headerShown: false,
            // animation: "slide_from_right",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
     }}
        >
            {/* {(isSplash) && <Stack.Screen name={Constants.splash} component={screens.SplashScreen}  options={{gestureEnabled: false}}/>} */}
            <Stack.Screen name={Constants.dealsTab} component={TabNavigator} options={{ gestureEnabled: false }} />
            <Stack.Screen name={Constants.editProfile} component={screens.EditProfile} options={{ gestureEnabled: true }} />
            <Stack.Screen name={Constants.createPassword} component={screens.CreatePassword} options={{ gestureEnabled: true }} />
            <Stack.Screen name={Constants.chat} component={screens.Chat} options={{ gestureEnabled: false }} />
            <Stack.Screen name={Constants.coinDetail} component={screens.CoinDetail} options={{ gestureEnabled: true }} />
            <Stack.Screen name={Constants.transfer} component={screens.Transfer} options={{ gestureEnabled: true }} />
            <Stack.Screen name={Constants.withdraw} component={screens.Withdraw} options={{ gestureEnabled: true }} />
            <Stack.Screen name={Constants.OfferDetail} component={screens.OfferDetail} options={{ gestureEnabled: true }}/>
            <Stack.Screen name={Constants.UpdateOffer} component={screens.UpdateOffer} options={{ gestureEnabled: true }} />
            <Stack.Screen name={Constants.Transactions} component={screens.Transactions} options={{ gestureEnabled: true }}/>
            <Stack.Screen name={Constants.TransactionDetail} component={screens.TransactionDetail} options={{ gestureEnabled: true }}/>
            <Stack.Screen name={Constants.OfferFilters} component={screens.OfferFilters} options={{ gestureEnabled: true }}/>
            <Stack.Screen name={Constants.TransactionFilter} component={screens.TransactionFilter} options={{ gestureEnabled: true }}/>

            <Stack.Screen name={Constants.Support} component={screens.Support} options={{ gestureEnabled: true }}/>
            <Stack.Screen name={Constants.TradeHistory} component={screens.TradeHistory} options={{ gestureEnabled: true }}/>
            <Stack.Screen name={Constants.Notifications} component={screens.Notifications} options={{ gestureEnabled: true }}/>
            <Stack.Screen name={Constants.FAQ} component={screens.FAQ} options={{ gestureEnabled: true }}/>
            <Stack.Screen name={Constants.How_It_Works} component={screens.HowItWorks} options={{ gestureEnabled: true }}/>


            <Stack.Screen name={Constants.BuyDeal} component={screens.BuyDeal} options={{ gestureEnabled: true }}/>

        </Stack.Navigator >

    )
}
export default MainStack;


