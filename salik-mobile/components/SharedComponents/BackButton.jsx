import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { clearLocation } from '../../redux/slices/locationSlice';

const BackButton = () => {
    const router = useRouter();
    const dispatch=useDispatch()
    return (
     <TouchableOpacity onPress={() =>{ router.back() ,dispatch(clearLocation())}} style={styles.backButton}>
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
