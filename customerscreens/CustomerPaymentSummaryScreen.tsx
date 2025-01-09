import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const CustomerPaymentSummaryScreen: React.FC<{ route: any }> = ({ route }) => {
  const { bookings } = route.params;

  // initial value 0
  const defaultPaymentModes = {
    Cash: 0.0,
    PhonePe: 0.0,
    'Google Pay': 0.0,
  };

  // Categorize payments by mode, merging with defaults
  const categorizedPayments = bookings.reduce((acc: any, booking: any) => {
    const mode = booking.paymentMode || 'Unknown';
    acc[mode] = (acc[mode] || 0) + parseFloat(booking.price || 0);
    return acc;
  }, defaultPaymentModes);

  const paymentModes = Object.entries(categorizedPayments);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Summary</Text>
      <FlatList
        data={paymentModes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.paymentCard}>
            <Text style={styles.paymentMode}>{item[0]}</Text>
            <Text style={styles.paymentAmount}>₹ {item[1].toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  paymentMode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default CustomerPaymentSummaryScreen;
