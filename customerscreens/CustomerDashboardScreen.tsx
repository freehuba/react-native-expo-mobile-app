import React, { useEffect, useState, useCallback} from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';


const CustomerDashboardScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { userId } = route.params;

  const [bookings, setBookings] = useState([]);
  const [servicesCount, setServicesCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Fetch customer data
  const fetchCustomerData = async () => {
    try {
      const response = await fetch(
        `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}.json`
      );
      const data = await response.json();

      if (data) {
        setBookings(data.bookings ? Object.values(data.bookings) : []);
        const total = data.bookings
          ? Object.values(data.bookings).reduce((sum: number, booking: any) => sum + parseFloat(booking.price || 0), 0)
          : 0;
        setTotalSpent(total);
      }

      // Fetch available services count
      const servicesResponse = await fetch(
        'https://loaclservicemarketplace-default-rtdb.firebaseio.com/users.json'
      );
      const allData = await servicesResponse.json();

      const serviceProviders = Object.values(allData).filter(
        (user: any) => user.role === 'service_provider'
      );
      const totalServices = serviceProviders.reduce((count: number, provider: any) => {
        return count + (provider.services ? Object.keys(provider.services).length : 0);
      }, 0);
      setServicesCount(totalServices);
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchCustomerData();
    }, [route])
  );

  return (
    <ScrollView style={styles.container}>

      {/* Overview Cards */}
      <View style={styles.card}>
        <Icon name="calendar-check-o" size={30} color="#007bff" />
        <Text style={styles.cardTitle}>Total Bookings</Text>
        <Text style={styles.cardValue}>{bookings.length}</Text>
      </View>

      {/* Clickable Available Services Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CustomerServiceRequests', { userId })}
      >
        <Icon name="list" size={30} color="#28a745" />
        <Text style={styles.cardTitle}>Available Services</Text>
        <Text style={styles.cardValue}>{servicesCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}         
      onPress={() => navigation.navigate('CustomerPaymentSummary', { userId, bookings })}
      >
        <Icon name="money" size={30} color="#ffc107" />
        <Text style={styles.cardTitle}>Total Spent</Text>
        <Text style={styles.cardValue}>₹ {totalSpent.toFixed(2)}</Text>
      </TouchableOpacity>

      {/* Recent Bookings */}
      <Text style={styles.sectionTitle}>Recent Bookings</Text>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings.slice(0, 10)} // Show only the latest 10 bookings
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bookingCard}
              onPress={() => navigation.navigate('CustomerBookingHistory', { userId })}>
              <Text style={styles.bookingServiceName}>{item.serviceName}</Text>
              <Text style={styles.bookingDetails}>
                Date: {item.date} | Time: {item.timeSlot}
              </Text>
              <Text style={styles.bookingPrice}>₹ {item.price}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No recent bookings found.</Text>
      )}

      {/* Call to Action */}
      <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Explore', 'Navigate to Explore Services!')}>
        <Text style={styles.actionButtonText}>Explore More Services</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  bookingCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bookingServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingDetails: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomerDashboardScreen;
