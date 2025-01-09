import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { validatePasswords } from '../validation'; // Import validation function

const CustomerResetPasswordScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle password reset request
  const handleResetPassword = async () => {
    const { valid, message } = validatePasswords(currentPassword, newPassword, confirmNewPassword);
    if (!valid) {
      Alert.alert('Error', message);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}.json`
      );
      const userData = await response.json();

      if (userData.password !== currentPassword) {
        Alert.alert('Current password is incorrect.');
        return;
      }

      // If current password is correct, update the password in Firebase
      const updateResponse = await fetch(
        `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      if (updateResponse.ok) {
        Alert.alert('Success', 'Password has been reset successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Failed to reset the password. Please try again.');
      }
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {/* Current Password */}
      <TextInput
        style={styles.input}
        placeholder="Old Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      {/* New Password */}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Confirm New Password */}
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />

      {/* Reset Password Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.buttonText}>Processing...</Text>
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomerResetPasswordScreen;
