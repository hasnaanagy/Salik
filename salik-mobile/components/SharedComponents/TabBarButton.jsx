import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { icons } from '../../constants/icons';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const TabBarButton = ({ onPress, onLongPress, label, route, isFocused, isDrawerOpen }) => {
  const { colors } = useTheme();


  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 }], 
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return { opacity: 1 }; 
  });

  return (
    <PlatformPressable
      android_ripple={{ color: 'transparent' }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      <View style={styles.iconTextContainer}>
        <Animated.View style={[animatedIconStyle, styles.icon]}>
          {icons[route.name]({ color: '#000' })}
        </Animated.View>
        <Animated.Text style={[styles.text, animatedTextStyle]}>
          {label}
        </Animated.Text>
      </View>
    </PlatformPressable>
  );
};

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {

    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000', 
    fontSize: 12, 
    marginTop: 2, 
  }
});

export default TabBarButton;