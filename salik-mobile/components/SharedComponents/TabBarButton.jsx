import React, { useEffect } from 'react';
import { StyleSheet, useAnimatedValue } from 'react-native';
import { icons } from '../../constants/icons';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import Animated, { useSharedValue, withSpring, interpolate ,useAnimatedStyle} from 'react-native-reanimated';
const TabBarButton = ({onPress,onLongPress,label,route,isFocused}) => {
const { colors } = useTheme();
const scale=useSharedValue(0);
useEffect(()=>{
scale.value=withSpring(
  typeof isFocused==='boolean'? (isFocused?1:0):isFocused,
  {duration:350}
);
},[scale,isFocused])
const animatedTextStyle=useAnimatedStyle(()=>{
  const opacity=interpolate(scale.value,[0,1],[1,0]);
  return {opacity};
})
const animatedIconStyle=useAnimatedStyle(()=>{
  const scaleValue=interpolate(scale.value,[0,1],[1,1.2]);
  const top=interpolate(scale.value,[0,1],[0,9]);
  return{
    transform:[{
      scale:scaleValue,
    }],top
  }
})
    return (
        <PlatformPressable
        android_ripple={{ color: 'transparent' }}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabBarItem}
      >
        <Animated.View style={animatedIconStyle}>
        {icons[route.name]({ color: isFocused ? "#fff" : colors.text })}
        </Animated.View>
        <Animated.Text style={[{ color: isFocused ? "#fff" : colors.text },animatedTextStyle]} >
          {label}
        </Animated.Text>
      </PlatformPressable>
    );
}

const styles = StyleSheet.create({
    tabBarItem:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
      
    }
})

export default TabBarButton;
