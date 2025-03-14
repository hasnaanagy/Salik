import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
const BackButton = () => {
    const router = useRouter();
    return (
     <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
         <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
})

export default BackButton;
