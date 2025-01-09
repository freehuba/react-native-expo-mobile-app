import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';

const Login: React.FC<any> = ({ navigation, route }) => {
  const { role } = route.params;  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleEmailChange = (text: string) => {
     setEmail(text.toLowerCase());
    };

  // Function to handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Fetch all users from Firebase
      const response = await fetch('https://loaclservicemarketplace-default-rtdb.firebaseio.com/users.json');
      const data = await response.json();

      // Find user with matching email, password, and role
      const userEntry = Object.entries(data).find(
        ([key, user]: [string, any]) =>
          user.email === email && user.password === password && user.role === role
      );

      if (userEntry) {

      const [userId, userDetails] = userEntry;

        // Valid credentials
        Alert.alert('Success', `Logged in as ${email}`);
        
        // Navigate to the respective dashboard based on role
        navigation.navigate(role === 'customer' ? 'CustomerDrawerNavigator' : 'DrawerNavigator',
          { userId, userDetails }
          );
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to log in');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign In to Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Registration', { role })}>
        <Text style={styles.switchRoleText}>
          Not registered? Register <Text style={styles.linkText}>here</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    fontSize: 28,
    fontWeight: '600',
    color: '#1e2a3a', 
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 24,
    paddingLeft: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#2874f0', 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
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

export default Login;
