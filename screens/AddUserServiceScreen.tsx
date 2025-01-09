import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  validateServiceName,
  validatePrice,
  validateDescription,
} from '../validation'; 
import { useNavigation, useRoute } from '@react-navigation/native';


const AddUserServiceScreen = () => {
  const { params } = useRoute();
  const { userId } = params;
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();


  const handleAddService = async () => {
    const serviceNameError = validateServiceName(serviceName);
    const priceError = validatePrice(price);
    const descriptionError = validateDescription(description);

    if (serviceNameError || priceError || descriptionError) {
      Alert.alert('Error', `${serviceNameError || ''}\n${priceError || ''}\n${descriptionError || ''}`);
      return;
    }

    const newService = {
      name: serviceName,
      price,
      description,
    };

    setLoading(true);

    try {
      const response = await fetch(
        `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/services.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newService),
        }
      );

      if (response.ok) {
        Alert.alert('Success', 'Service added successfully!');
        setServiceName('');
        setPrice('');
        setDescription('');
        navigation.goBack();

      } else {
        Alert.alert('Somthing went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Service</Text>

      <TextInput
        style={styles.input}
        placeholder="Service Name"
        value={serviceName}
        onChangeText={setServiceName}
      />

      <TextInput
        style={styles.input}
        placeholder="Price (in ₹)"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddService} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddUserServiceScreen;
