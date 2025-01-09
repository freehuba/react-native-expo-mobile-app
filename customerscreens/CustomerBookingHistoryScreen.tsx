import React, { useState, useCallback } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../validation';
import { useNavigation } from '@react-navigation/native';


const CustomerBookingHistoryScreen = ({ route }) => {
  const { userId } = route.params;
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const navigation = useNavigation();

  const firebaseUrl = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/bookings.json`;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(firebaseUrl);
      if (!response.ok) Alert.alert('Failed to fetch bookings');

      const data = await response.json();
      const bookingsList = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));
      setBookings(bookingsList);
      setFilteredBookings(bookingsList); // Initialize filtered bookings
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookingsByDate = (date: string) => {
    const selectedDate = formatDate(date);
    const filtered = bookings.filter(
      (booking) => booking.date === selectedDate
    );
    setFilteredBookings(filtered);
  };

  const clearFilter = () => {
    setFilterDate(null);
    setFilteredBookings(bookings);
  };

  const onDateChange = (event: any, selectedDate: React.SetStateAction<null>) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFilterDate(selectedDate);
      filterBookingsByDate(selectedDate);
    }
  };

  const handleReviewBooking = (item: any) => {
    const { userId, serviceProviderId, serviceId } = item;
    navigation.navigate('CustomerReviewScreen',{
      userId,
      serviceProviderId,
      serviceId
    })

};

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [route])
  );

  const handleCancelBooking = async (bookingId: any) => {
    Alert.alert(
      'Confirm Cancel',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            try {
              const deleteUrl = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/bookings/${bookingId}.json`;
              const response = await fetch(deleteUrl, { method: 'DELETE' });

              if (!response.ok) Alert.alert('Somthing went wrong. Please try again.');

              setBookings((prevBookings) =>
                prevBookings.filter((booking) => booking.id !== bookingId)
              );
              Alert.alert('Success', 'Booking canceled successfully.');
              
              await fetchBookings();
            } catch (error) {
              Alert.alert('Failed to cancel booking.');
            }
          },
        },
      ]
    );
  };

const renderBookingCard = ({ item }) => (
  <ScrollView style={styles.card}>
    <Text style={styles.bookingServiceName}>{`Service: ${item.serviceName}`}</Text>
    <Text style={styles.bookingProviderName}>{`Provider: ${item.serviceProviderName}`}</Text>
    <Text style={styles.bookingPrice}>{`Price: ₹${item.price}`}</Text>
    <Text style={styles.paymentMode}>{`Payment Mode: ${item.paymentMode}`}</Text>
    <Text style={styles.paymentStatus}>{`Payment Status: ${item.paymentStatus}`}</Text>
    <Text style={styles.bookingDate}>{`Booked Date: ${item.date}`}</Text>
    <Text style={styles.bookingDate}>{`Booked Time: ${item.timeSlot}`}</Text>
    <View style={styles.buttonContainer}>
      {item.workStatus === 'Completed' ? (
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => handleReviewBooking(item)}
        >
          <Text style={styles.reviewButtonText}>Leave a Review</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelBooking(item.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  </ScrollView>
);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading Bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Date:</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.filterButtonText}>
            {filterDate
              ? filterDate.toLocaleDateString()
              : "Select a Date"}
          </Text>
        </TouchableOpacity>
        {filterDate && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
            <Text style={styles.clearButtonText}>Clear Filter</Text>
          </TouchableOpacity>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={filterDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noBookingsText}>No bookings available for the selected date.</Text>
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
  bookingServiceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288d1',
    marginBottom: 5,
  },
  bookingProviderName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  bookingDate: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  paymentMode: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  paymentStatus: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    width: '80%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
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
  noBookingsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  reviewButton: {
  backgroundColor: '#4caf50', 
  width: '80%',
  paddingVertical: 10,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
},
reviewButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
});

export default CustomerBookingHistoryScreen;
