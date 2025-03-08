import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import SearchBar from '../../components/HomeComponets/SearchBar';
import CustomText from '../../components/CustomeComponents/CustomText';
import RecentrlySearched from './RecentrlySearched';
import Services from './Services';
import Slider from './Slider';
const HomeComponent = () => {
    return (
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
