import { View, Platform, StyleSheet } from 'react-native';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import appColors from '../../constants/colors';
import TabBarButton from './TabBarButton';

export function TabBar({ state, descriptors, navigation }) {
  const [dimensions,setDimensions]=useState({height:20, width:100});
  const buttonWidth=dimensions.width/state.routes.length;
  const onTabBarLayout=(event)=>{
    setDimensions({
      height:event.nativeEvent.layout.height,
      width:event.nativeEvent.layout.width
    });
  }
  const tabPositionX=useSharedValue(0);
  const animatedStyle=useAnimatedStyle(()=>{
    return{
      transform:[{
        translateX:tabPositionX.value
      }]
    }
  })
  return (
    <View onLayout={onTabBarLayout} style={style.tabBar}>
      <Animated.View style={[animatedStyle,{
        position:'absolute',
        backgroundColor:appColors.primary,
        borderRadius:30,
        marginHorizontal:12,
        height:dimensions.height-15,
        width:buttonWidth-25
      }]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value=withSpring(buttonWidth*index,{duration:1500});
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
            <TabBarButton 
            onPress={onPress}
                onLongPress={onLongPress}
                key={route.key}
                isFocused={isFocused}
                label={label}
                route={route}
            />
        );
      })}
    </View>
  );
}

const style=StyleSheet.create({
    tabBar:{
        flexDirection:'row',
        backgroundColor:'white',
        justifyContent:'space-between',
        alignItems:'center',
        position:'absolute',
        bottom:Platform.OS==='ios'?50:20,
        marginHorizontal:30,
        shadowColor:'#000',
        shadowOffset:{width:0,height:10},
        shadowOpacity:0.1,
        shadowRadius:10,
        borderRadius:30,
        paddingVertical:Platform.OS==='ios'?14:8,
    },

})