import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../CustomeComponents/CustomText';

const RecentlySearched = () => {
    const [searchHistory, setSearchHistory] = useState(["New York", "Cairo", "London"]);

    return (
        <View style={styles.container}>
            <CustomText style={styles.title}>Recently Searched</CustomText>

            <FlatList
                data={searchHistory}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => console.log(item)}>
                        <Ionicons name="time-outline" size={20} color="#666" style={styles.icon} />
                        <CustomText style={styles.text}>{item}</CustomText>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default RecentlySearched;

const styles = StyleSheet.create({
    container:{
    marginLeft:10,
    marginRight:10,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 10,
        backgroundColor: '#eee',
        marginVertical: 5,

    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
});
