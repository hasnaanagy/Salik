import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, TextInput, Dimensions, Image, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { sendRequestAction } from '../../redux/slices/requestServiceSlice';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import CustomText from '../CustomeComponents/CustomText';
const { width, height } = Dimensions.get('window');

const CustomerRequests = () => {
    const [activeTab, setActiveTab] = useState('fuel');
    const [description, setDescription] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();
    const router = useRouter();

    // Get user location on component mount
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        })();
    }, []);

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        Animated.timing(slideAnim, {
            toValue: tab === 'fuel' ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.4],
    });

    const handleSubmit = async () => {
        if (!userLocation) {
            Alert.alert('Error', 'Location not available yet');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return;
        }

        try {
            const serviceType = activeTab === 'fuel' ? 'fuel' : 'mechanic';
            const locationString = `${userLocation.latitude},${userLocation.longitude}`;

            await dispatch(sendRequestAction({
                serviceType,
                location: locationString,
                problem: description
            })).unwrap();

            setDescription('');
            // Navigate to requests page after successful submission
            router.push('/requests');
        } catch (error) {
            Alert.alert('Error', 'Failed to submit request: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <Animated.View style={[styles.tabBackground, { transform: [{ translateX }] }]} />
                <TouchableOpacity style={styles.tab} onPress={() => handleTabSwitch('fuel')}>
                    <CustomText style={[styles.tabText, activeTab === 'fuel' ? styles.activeTabText : styles.inactiveTabText]}>
                        Fuel Request
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => handleTabSwitch('mechanic')}>
                    <CustomText style={[styles.tabText, activeTab === 'mechanic' ? styles.activeTabText : styles.inactiveTabText]}>
                        Mechanic Request
                    </CustomText>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Image source={require('../../assets/help.png')} style={styles.imageStyle} />
                <TextInput
                    style={styles.formTextArea}
                    placeholder="Describe your problem"
                    placeholderTextColor="#999"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <CustomText style={styles.buttonText}>Request Service</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Light background like the map
        paddingHorizontal: width * 0.05, // 5% of screen width for padding
        paddingVertical: height * 0.03, // 3% of screen height for padding
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0', // Gray background for the tabs
        borderRadius: 25,
        width: width * 0.8, // 80% of screen width
        height: height * 0.07, // 7% of screen height
        position: 'relative',
        overflow: 'hidden',
        marginBottom: height * 0.03, // 3% of screen height
        alignSelf: 'center',
    },
    tabBackground: {
        position: 'absolute',
        backgroundColor: '#f5c518', // Yellow background for active tab
        width: width * 0.4, // Half of tabContainer width (40% of screen width)
        height: '100%',
        borderRadius: 25,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: width * 0.04, // Responsive font size (4% of screen width)
        fontWeight: '600',
    },
    activeTabText: {
        color: '#000', // Black text for active tab
    },
    inactiveTabText: {
        color: '#666', // Gray text for inactive tab
    },
    form: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5, // For Android shadow
        padding: width * 0.05, // 5% of screen width for padding
    },
    formHeader: {
        backgroundColor: '#f5c518', // Yellow header to match the theme
        paddingVertical: height * 0.02, // 2% of screen height
        paddingHorizontal: width * 0.05, // 5% of screen width
        borderRadius: 15,
        marginBottom: height * 0.02, // 2% of screen height
    },
    formTitle: {
        fontSize: width * 0.05, // Responsive font size (5% of screen width)
        fontWeight: '700',
        color: '#000', // Black text for contrast
        textAlign: 'center',
    },
    formTextArea: {
        width: '100%',
        padding: width * 0.03, // 3% of screen width
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        fontSize: width * 0.04, // Responsive font size
        color: '#333',
        backgroundColor: '#f9f9f9',
        textAlignVertical: 'top', // For multiline input
        marginBottom: height * 0.02, // 2% of screen height
        height: height * 0.15, // Reduced height to 15% of screen height
    },
    button: {
        alignSelf: 'center', // Center the button
        width: width * 0.5, // Reduced width to 50% of screen width
        backgroundColor: '#f5c518', // Yellow button
        paddingVertical: height * 0.015, // Reduced padding to 1.5% of screen height
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5, // For Android shadow
    },
    buttonText: {
        color: '#000', // Black text
        fontSize: width * 0.04, // Responsive font size
        fontWeight: '600',
    },
    imageStyle: {
        width: '65%',
        height: '50%',
        alignSelf: 'center'
    }
});

export default CustomerRequests;