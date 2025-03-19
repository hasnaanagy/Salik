import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../CustomeComponents/CustomText';

const RecentlySearched = () => {
    const [searchHistory, setSearchHistory] = useState(["Alexandria", "Cairo"]);

    return (
        <View style={{marginTop:20}} >
            <CustomText >Recently Searched</CustomText>

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
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Platform.OS === 'ios' ? 14 : 12,
        paddingHorizontal: 10,
        backgroundColor: '#ddd',
        marginVertical: 5,
        borderRadius: 8,

    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
});
