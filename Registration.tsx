import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, SafeAreaView ,ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import { RouteProp } from '@react-navigation/native';

// Import validation functions
import {
  validateFullName,
  validateEmail,
  validatePhoneNumber,
  validateAge,
  validateAddress,
  validatePincode,
  validatePassword,
} from './validation';

type RootStackParamList = {
  Registration: { role: string };
};

type RegistrationRouteProp = RouteProp<RootStackParamList, 'Registration'>;

const Registration: React.FC<{ route: RegistrationRouteProp, navigation: any }> = ({ route, navigation }) => {
  const { role } = route.params;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageUri, setImageUri] = useState('https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg');


  const handleEmailChange = (text: string) => {
     setEmail(text.toLowerCase());
    };

  const handleSubmit = async () => {
    // Run validation checks
    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const phoneError = validatePhoneNumber(phone);
    const ageError = validateAge(age);
    const addressError = validateAddress(address);
    const pincodeError = validatePincode(pincode);
    const passwordError = validatePassword(password);

    // Check if any error messages exist
    if (fullNameError || emailError || phoneError || ageError || addressError || pincodeError || passwordError) {
      Alert.alert('required', fullNameError || emailError || phoneError || ageError || addressError || pincodeError || passwordError);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const userData = {
      fullName,
      email,
      phone,
      age,
      address,
      pincode,
      password,
      role,
      imageUri
    };

    try {
      // Make a POST request to store data in Firebase Realtime Database
      const response = await fetch(
        'https://loaclservicemarketplace-default-rtdb.firebaseio.com/users.json', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        Alert.alert('Success', 'User registered successfully!');

        // Clear fields after successful registration
        setFullName('');
        setEmail('');
        setPhone('');
        setAge('');
        setAddress('');
        setPincode('');
        setPassword('');
        setConfirmPassword('');

        // Redirect to Login page
        navigation.navigate('Login', { role });
      } else {
        Alert.alert('Error', 'Failed to register user');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register user');
    }
  };

  return (
    <KeyboardAvoidingView 
    style={{ flex: 1 }} 
    behavior="padding" 
    keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>

    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} 
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}>

      <Text style={styles.header}>SignUp Here</Text>

      <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={handleEmailChange} style={styles.input} />
      <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Age" value={age} onChangeText={setAge} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
      <TextInput placeholder="Pincode" value={pincode} onChangeText={setPincode} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <TextInput placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />

      <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login', { role })}>
        <Text style={styles.switchRoleText}>
          Already Registered? Login <Text style={styles.linkText}> here</Text>
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e2a3a', 
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  input: {
    height: 42,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#2874f0', 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  switchRoleText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
   linkText: {
    color: '#2874f0', 
    textDecorationLine: 'none', 
  },
});

export default Registration;
