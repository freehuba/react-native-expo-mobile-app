import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const EditServiceScreen = ({ route, navigation }) => {
  const { userId, serviceId } = route.params;
  const [serviceDetails, setServiceDetails] = useState({ name: '', price: '', description: '' });
  const firebaseUrl = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/services/${serviceId}.json`;

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        setServiceDetails(data || {});
      } catch (error) {
         Alert.alert('Somthing went wrong. Please try again.');
      }
    };
    fetchService();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch(firebaseUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceDetails),
      });
      if (!response.ok) Alert.alert('Failed to update service');
      Alert.alert('Success', 'Service updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service Name:</Text>
      <TextInput
        style={styles.input}
        value={serviceDetails.name}
        onChangeText={(text) => setServiceDetails({ ...serviceDetails, name: text })}
      />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={serviceDetails.price}
        onChangeText={(text) => setServiceDetails({ ...serviceDetails, price: text })}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        multiline
        value={serviceDetails.description}
        onChangeText={(text) => setServiceDetails({ ...serviceDetails, description: text })}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
});

export default EditServiceScreen;
