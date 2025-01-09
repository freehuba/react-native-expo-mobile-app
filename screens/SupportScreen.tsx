import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

const SupportScreen = () => {
  const [userQuery, setUserQuery] = useState('');

  // Function to handle form submission (simulate sending a query)
  const handleSubmitQuery = () => {
    if (!userQuery) {
      Alert.alert('Error', 'Please enter your query.');
      return;
    }

    // Simulate sending the query to support (replace with actual logic)
    Alert.alert('Query Submitted', 'Your query has been submitted to support.');
    setUserQuery('');
  };

  return (
    <View style={styles.container}>

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Contact Us</Text>
        <Text style={styles.contactText}>Email: support@localservices.com</Text>
        <Text style={styles.contactText}>Phone: +1 (800) 123-4567</Text>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Frequently Asked Questions</Text>
        <Text style={styles.faqText}>Q: How do I reset my password?</Text>
        <Text style={styles.faqText}>A: Go to settings and click on "Reset Password".</Text>
        <Text style={styles.faqText}>Q: How do I contact support?</Text>
        <Text style={styles.faqText}>A: Use the contact information above or submit a query below.</Text>
      </View>

      {/* Submit a Query Form */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Submit a Query</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your query here"
          value={userQuery}
          onChangeText={setUserQuery}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuery}>
          <Text style={styles.submitButtonText}>Submit Query</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Option (Placeholder for Future Integration) */}
      <TouchableOpacity style={styles.chatButton} onPress={() => Alert.alert('Chat', 'Support Chat is coming soon!')}>
        <Text style={styles.chatButtonText}>Start Chat with Support</Text>
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
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#555',
  },
  faqText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  chatButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SupportScreen;
