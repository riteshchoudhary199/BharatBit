

import { StackActions } from '@react-navigation/compat';
import { CommonActions } from '@react-navigation/native';
/**
 * The navigation is implemented as a service so that it can be used outside of components, for example in sagas.
 *
// @see https://reactnavigation.org/docs/navigating-without-navigation-prop
 */

let navigator
/**
 * This function is called when the RootScreen is created to set the navigator instance to use.
 */
function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef

}

const getCurrentRouteName = () => {
	if( navigator !== null) {
    console.log('getCurrentRouteName :---',navigator.getCurrentRoute())
		return navigator?.getCurrentRoute().name;
	}
	else{
		return ''
	}
  }

  const getCurrentRoute = () => {
    if( navigator !== null) {
      console.log('getCurrentRouteName :---',navigator?.getCurrentRoute())
      return navigator?.getCurrentRoute();
    }
    else{
      return ''
    }
    }


/**
 * Call this function when you want to navigate to a specific route.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
function navigate(name, params) {
 navigator?.dispatch(
  CommonActions.navigate({
    name,
    params,
  })
)
}

/**
 * Call this function when you want to navigate to a specific route AND reset the navigation history.
 *
 * That means the user cannot go back. This is useful for example to redirect from a splashscreen to
 * the main screen: the user should not be able to go back to the splashscreen.
 *
 * @param routeName The name of the route to navigate to. Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
function navigateAndReset(name, params) {
  navigator?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
  })
  )
}
function popScreen()
{
  const popAction = StackActions.pop(1);

  navigator?.dispatch(popAction);
}
function goBack() {
  // popScreen()
  navigator?.dispatch({
    ...CommonActions.goBack()
  });
}
function replaceNavigateRoute(name,replaceScreen)
{
  
  navigator?.dispatch(state => {
    // Remove the home route from the stack
    const routes = state.routes.filter(r => r.name !==replaceScreen);
  
    return CommonActions.reset({
      ...state,
      routes,
      index: routes.length - 1,
    });
  })
  navigator?.navigate(name)
}


export default {
  navigate,
  navigateAndReset,
  setTopLevelNavigator,
  replaceNavigateRoute,
  popScreen,
  goBack,
  getCurrentRouteName,
  getCurrentRoute
}
