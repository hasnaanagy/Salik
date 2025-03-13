import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import appColors from '../../constants/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const ConfirmPickUpComponent = ({onSearchPress}) => {
    const{fromLocation,toLocation,focusedInput}=useSelector((state)=>state.location)

    return (
        <View>
        <TouchableOpacity style={styles.searchContainer} onPress={onSearchPress}>
        <FontAwesome5 name="dot-circle" size={20} color="black" />
        <Text style={{color:"grey"}}>{focusedInput=="fromLocation"&&fromLocation?fromLocation:focusedInput=="toLocation"&&toLocation?toLocation:"Search"}</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer:{
        flexDirection:"row",
        gap:10,
        backgroundColor: "#eee",
        padding: 15,
        borderRadius: 14,
        width: "90%",
        alignSelf: "center",
        marginVertical: 30
      },
   
})

export default ConfirmPickUpComponent;
