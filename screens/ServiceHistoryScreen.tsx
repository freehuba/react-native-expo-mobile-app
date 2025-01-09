import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const ServiceHistoryScreen = ({ navigation, route }) => {
  const { userId } = route.params; 
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const firebaseUrl = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/services.json`;

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(firebaseUrl);
      if (!response.ok)    Alert.alert('Somthing went wrong. Please try again.');


      const data = await response.json();
      const servicesList = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));
      setServices(servicesList);
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch services when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [route])
  );

  const handleDeleteService = async (serviceId: any) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const deleteUrl = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/services/${serviceId}.json`;
              const response = await fetch(deleteUrl, { method: 'DELETE' });

              if (!response.ok)  Alert.alert('Somthing went wrong. Please try again.');


              setServices((prevServices) =>
                prevServices.filter((service) => service.id !== serviceId)
              );
              Alert.alert('Success', 'Service deleted successfully.');
            } catch (error) {
              Alert.alert('Somthing went wrong. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderServiceCard = ({ item }) => (
    <ScrollView style={styles.card}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.servicePrice}>{`${item.price} ₹`}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditService', { userId, serviceId: item.id })}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteService(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading Services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddUserService', { userId })}
      >
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>
      {services.length > 0 ? (
        <FlatList
          data={services}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noServicesText}>No services available.</Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},
  editButton: {
    backgroundColor: '#007bff',
    width: '45%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    width: '45%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noServicesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
    addButton: {
    backgroundColor: '#2874f0', 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ServiceHistoryScreen;
