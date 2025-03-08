import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import CustomText from '../CustomeComponents/CustomText';

const { width } = Dimensions.get('window'); // Get screen width
const numItems = 3; 

const Services = () => {
    const data = [
        { id: "1", title: "Ride", image: require("../../assets/car.png") },
        { id: "2", title: "Fuel", image: require("../../assets/gas-pump.png")},
        { id: "3", title: "Mechanic", image: require("../../assets/technician.png") }
    ];

    return (
        <View >
            <CustomText >Services</CustomText>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item}>
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.text}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        width: width / numItems - 30, // Each item takes 1/3 of the screen width (minus margin)
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 5, 
        display: 'flex',
        gap: 8
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
    },
    image:{
        width: 40,
        height: 40
    }
});

export default Services;
