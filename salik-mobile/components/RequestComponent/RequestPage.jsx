import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllResquestsAction, confirmRequestAction, updateRequestStateAction } from '../../redux/slices/requestServiceSlice';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const statusColors = {
    pending: '#FFC107',
    accepted: '#2196F3',
    confirmed: '#4CAF50',
    completed: '#673AB7',
};

const RequestPage = ({ userType }) => {
    const dispatch = useDispatch();
    const { requests = {}, isLoading } = useSelector(state => state.requestSlice || {});
    const { user } = useSelector(state => state.auth);

    const [selectedProvider, setSelectedProvider] = useState({});
    const [locations, setLocations] = useState({});

    useEffect(() => {
        dispatch(getAllResquestsAction());
    }, [dispatch, user]);

    const getAddressFromCoordinates = async (lat, lng, requestId) => {
        try {
            const apiKey = '2d4b78c5799a4d8292da41dce45cadde';
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
            );
            const address = response.data.results[0]?.formatted || 'Unknown location';
            setLocations(prev => ({ ...prev, [requestId]: address }));
        } catch (error) {
            console.error('Error fetching address:', error);
            setLocations(prev => ({ ...prev, [requestId]: 'Location not found' }));
        }
    };

    useEffect(() => {
        Object.entries(requests).forEach(([status, reqList]) => {
            reqList.forEach(req => {
                if (req.location?.coordinates) {
                    const [lng, lat] = req.location.coordinates;
                    getAddressFromCoordinates(lat, lng, req._id);
                }
            });
        });
    }, [requests]);

    const handleAcceptRequest = async requestId => {
        await dispatch(updateRequestStateAction({ requestId, action: 'accept' }));
        dispatch(getAllResquestsAction());
    };

    const handleConfirmProvider = async requestId => {
        if (!selectedProvider[requestId]) return;
        await dispatch(
            confirmRequestAction({
                requestId,
                action: 'confirm',
                providerId: selectedProvider[requestId],
            })
        );
        dispatch(getAllResquestsAction());
    };

    const handleCompleteRequest = async requestId => {
        await dispatch(updateRequestStateAction({ requestId, action: 'complete' }));
        dispatch(getAllResquestsAction());
    };

    if (isLoading) {
        return (
            <View style={styles.centeredView}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading requests...</Text>
            </View>
        );
    }

    if (!requests || Object.values(requests).every(arr => arr.length === 0)) {
        return (
            <View style={styles.centeredView}>
                <Text>No requests found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Service Requests</Text>
            {Object.entries(requests).map(([status, reqList]) =>
                reqList.length > 0 && (
                    <View key={status}>
                        <Text style={[styles.statusHeader, { color: statusColors[status] }]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)} Requests
                        </Text>
                        {reqList.map(req => (
                            <View key={req._id} style={styles.card}>
                                <Text style={styles.title}>{req.serviceType}</Text>
                                <Text>📍 {locations[req._id] || 'Fetching location...'}</Text>
                                <Text>📝 Problem: {req.problemDescription}</Text>

                                {user?.type === 'provider' && status === 'pending' && (
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => handleAcceptRequest(req._id)}
                                    >
                                        <Text style={styles.buttonText}>Accept Request</Text>
                                    </TouchableOpacity>
                                )}

                                {user?.type === 'customer' && status === 'accepted' && req.acceptedProviders?.length > 0 && (
                                    <>
                                        <Text style={styles.label}>Select a Provider:</Text>
                                        <Picker
                                            selectedValue={selectedProvider[req._id] || ''}
                                            onValueChange={value =>
                                                setSelectedProvider({
                                                    ...selectedProvider,
                                                    [req._id]: value,
                                                })
                                            }
                                        >
                                            {req.acceptedProviders.map(provider => (
                                                <Picker.Item key={provider._id} label={`${provider.fullName} (${provider.phone})`} value={provider._id} />
                                            ))}
                                        </Picker>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => handleConfirmProvider(req._id)}
                                            disabled={!selectedProvider[req._id]}
                                        >
                                            <Text style={styles.buttonText}>Confirm Provider</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {user?.type === 'customer' && status === 'confirmed' && (
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => handleCompleteRequest(req._id)}
                                    >
                                        <Text style={styles.buttonText}>Mark as Completed</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    statusHeader: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
    card: { padding: 15, marginBottom: 15, borderRadius: 10, backgroundColor: '#f9f9f9' },
    title: { fontSize: 18, fontWeight: 'bold' },
    button: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, marginTop: 10 },
    buttonText: { color: '#fff', textAlign: 'center' },
    label: { fontWeight: 'bold', marginTop: 10 },
});

export default RequestPage;
