import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { useRouter } from 'expo-router';

const SearchBar = () => {
    const router =useRouter()
    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TouchableOpacity style={styles.searchContainer} onPress={()=>router.push('search')}>
                    <Text style={styles.placeholderText}>Where to ?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // paddingHorizontal: 16,
    },
    searchContainer: {
        flex: 1,  // Allows it to take the available space
        justifyContent: 'center',
        paddingVertical: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 30,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: '100%',
        height: 50,
    },
    placeholderText: {
        fontSize: 16,
        color: '#888',
    },
    searchIcon: {
        marginRight: 10,
    },
});

export default SearchBar;
