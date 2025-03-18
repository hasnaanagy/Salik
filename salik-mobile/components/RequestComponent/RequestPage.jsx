import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getAllResquestsAction, confirmRequestAction, updateRequestStateAction } from '../../redux/slices/requestServiceSlice';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const statusColors = {
  pending: '#FFC107',
  accepted: '#2196F3',
  confirmed: '#4CAF50',
  completed: '#673AB7',
};

const RequestPage = () => {
  const dispatch = useDispatch();
  const { requests = {}, isLoading } = useSelector(state => state.requestSlice || {});

  const [selectedProvider, setSelectedProvider] = useState({});
  const [locations, setLocations] = useState({});
  const [userType, setUserType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserType = async () => {
    try {
      const storedUserType = await AsyncStorage.getItem('userType');
      if (storedUserType) {
        setUserType(JSON.parse(storedUserType));
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  const fetchData = async () => {
    await fetchUserType();
    dispatch(getAllResquestsAction());
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [dispatch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleAcceptRequest = async requestId => {
    await dispatch(updateRequestStateAction({ requestId, action: 'accept' }));
    fetchData();
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
    fetchData();
  };

  const handleCompleteRequest = async requestId => {
    await dispatch(updateRequestStateAction({ requestId, action: 'complete' }));
    fetchData();
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
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Service Requests</Text>
      {Object.entries(requests).map(([status, reqList]) =>
        reqList.length > 0 && (
          <View key={status}>
            <Text style={[styles.statusHeader, { color: statusColors[status] }]}>
              {status.charAt(0).toUpperCase() + status.slice(1)} Requests
            </Text>
            {reqList.map(req => (
              <View key={req._id} style={[styles.card, { borderLeftColor: statusColors[status] }]}>
                <Text style={styles.title}>{req.serviceType}</Text>
                <Text>📍 {locations[req._id] || 'Fetching location...'}</Text>
                <Text>📝 Problem: {req.problemDescription}</Text>

                {userType === 'provider' && status === 'pending' && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAcceptRequest(req._id)}
                  >
                    <Text style={styles.buttonText}>Accept Request</Text>
                  </TouchableOpacity>
                )}

                {userType === 'customer' && status === 'accepted' && req.acceptedProviders?.length > 0 && (
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

                {userType === 'customer' && status === 'confirmed' && (
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  statusHeader: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  card: { padding: 15, marginBottom: 15, borderRadius: 10, backgroundColor: '#f9f9f9', shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, borderLeftWidth: 5, },
  title: { fontSize: 18, fontWeight: 'bold' },
  button: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: '#00ff00', textAlign: 'center' },
  label: { fontWeight: 'bold', marginTop: 10 },
});

export default RequestPage;