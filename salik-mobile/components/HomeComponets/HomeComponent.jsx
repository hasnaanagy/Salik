import React from 'react';
import { StyleSheet, View } from 'react-native';
import SearchBar from '../../components/HomeComponets/SearchBar';
import CustomText from '../../components/CustomeComponents/CustomText';
import RecentrlySearched from './RecentrlySearched';
const HomeComponent = () => {
    return (
        <View style={styles.container}>
            <SearchBar/>
            <RecentrlySearched/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 24,
        justifyContent: 'flex-start', 
        paddingHorizontal: 26, 
        paddingTop: 10
    },
})

export default HomeComponent;
