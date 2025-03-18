import React, { useState, useEffect, useCallback } from 'react';
import { Platform, StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import SearchBar from '../../components/HomeComponets/SearchBar';
import RecentrlySearched from './RecentrlySearched';
import Services from './Services';
import Slider from './Slider';

const HomeComponent = () => {
  const { user, error, loading } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

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
      {user?.type === "customer" && (
        <View>
        <SearchBar />
        <RecentrlySearched /> 
        </View>)}
      <Services />
      <Slider />
    </ScrollView>
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
});

export default HomeComponent;