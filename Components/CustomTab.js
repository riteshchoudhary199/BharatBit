import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';
import { CommonStyles, TextStyles } from '../Styles/ComnStyle';
import { moderateScale } from '../Styles/responsiveSize';
import Colors from '../Colors/Colors';
import { Constants } from '../Constants';
import { useSelector } from 'react-redux';


const CustomTab = ({ color, tab, onPress, icon, activeTabCheck }) => {
    console.log(activeTabCheck, "activeTabCheck");
    const {unreadNotifications} = useSelector((state)=>state.auth)

    const notiFyData = [{screen:Constants.deals,notifi:false},
       { screen:Constants.sells,notifi:false},
       { screen:Constants.trades,notifi:Number(unreadNotifications?.messageCount) > 0},
       { screen:Constants.wallet,notifi:false},
       { screen:Constants.account,notifi:false},
]

    const noti = notiFyData.find((item) => item?.screen == tab?.name)
    console.log('noti noti noti noti :---',tab.name);
    return (
        <TouchableOpacity style={{}}onPress={onPress}>
          

            <View style={{alignItems:'center',justifyContent:'center'}}>
                <View>
                { noti?.notifi == true &&
            <View style={{ position: 'absolute', height: 6, width: 6, top: -2,right:-6,alignSelf:'flex-end',backgroundColor: 'red', borderRadius: 5, }} />

            }
                <Image source={icon} 
                resizeMode='contain'
                style={[CommonStyles.tabIconStyle, {tintColor: activeTabCheck?.active == activeTabCheck?.index ? Colors.gradiantDwn : Colors.app_Black }]} />
                </View>
                <Text
                    style={[CommonStyles.tabBarLabelStyle, { ...TextStyles.regularMedium, color: activeTabCheck?.active == activeTabCheck?.index ? Colors.gradiantDwn : Colors.app_Black }]} >
                    {tab.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};


export default CustomTab;