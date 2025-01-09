import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RoleSelectionScreen: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome To ServiceHub</Text>

      <TouchableOpacity
        style={[styles.roleButton, styles.customerButton]}
        onPress={() => navigation.navigate('Registration', { role: 'customer' })}
      >
        <Text style={styles.roleButtonText}>I am a Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleButton, styles.providerButton]}
        onPress={() => navigation.navigate('Registration', { role: 'service_provider' })}
      >
        <Text style={styles.roleButtonText}>I am a Service Provider</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'ffffff'
  },
  headerText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2874f0',
    textAlign: 'center',
    marginBottom: 40,
  },
  roleButton: {
    width: '90%',
    paddingVertical: 18,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  customerButton: {
    backgroundColor: '#ff5722',
  },
  providerButton: {
    backgroundColor: '#4caf50',
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default RoleSelectionScreen;
