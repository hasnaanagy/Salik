import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import SearchBar from '../../components/HomeComponets/SearchBar';
import CustomText from '../../components/CustomeComponents/CustomText';
import RecentrlySearched from './RecentrlySearched';
import Services from './Services';
import Slider from './Slider';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeComponent = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } catch (error) {
            console.error("Error retrieving user from AsyncStorage:", error);
          }
        };
    
        fetchUser();
      }, []);
          return (
        console.log("local user",user?.type),
        <View style={styles.container}>
            <SearchBar/>
            <RecentrlySearched/>
            <Services/>
            <Slider/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: Platform.OS === 'ios' ? 20 : 12,
        justifyContent: 'flex-start', 
        paddingHorizontal: 26, 
        paddingTop: Platform.OS === 'ios' ? 10 : 0, 
        marginLeft:6,
        marginRight:6,

    },
})

export default HomeComponent;
