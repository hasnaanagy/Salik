import React, { useState, useEffect, useCallback } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/HomeComponets/SearchBar';
import RecentrlySearched from './RecentrlySearched';
import Services from './Services';
import Slider from './Slider';

const HomeComponent = () => {
  const { user, error, loading } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (user?.type) {
      onRefresh();
    }
  }, [user?.type, onRefresh]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
            colors={['#000']}
          />
        }
      >
        {user?.type === 'customer' ? (
          <View>
            <SearchBar />
            <RecentrlySearched />
            <Services />
            <Slider />
          </View>
        ) : user?.type === 'provider' ? (
          <View>
            <Services />
            <Slider />
          </View>
        ) : (
          <View>
            <SearchBar />
            <RecentrlySearched />
            <Services />
            <Slider />
          </View>
        )}
      </ScrollView>

      {/* ✅ Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('ChatInterface')}
      >
        <Text style={styles.chatButtonText}>💬</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    marginLeft: 6,
    marginRight: 6,
  },
  contentContainer: {
    gap: Platform.OS === 'ios' ? 20 : 12,
    justifyContent: 'flex-start',
  },
  chatButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: '#FFB800',
    padding: 14,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeComponent;
