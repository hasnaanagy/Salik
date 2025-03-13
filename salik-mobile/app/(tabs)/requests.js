import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Requests = () => {
    return (
        <View style={styles.container}>
            <Text>Requests</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default Requests;


