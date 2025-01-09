import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { formatDate } from '../validation';
import { useFocusEffect } from '@react-navigation/native';

interface Highlight {
  id: string;
  label: string;
  value: string;
}

interface Review {
  reviewRating: number;
}

interface Earning {
  withdrawAmount: number;
}

const DashboardScreen: React.FC = ({ route }) => {
  const { userId } = route.params;
  const [filterDate, setFilterDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Fetch data from Firebase
  const fetchData = async () => {
    try {
      const { bookings, earnings, reviews } = await getData(userId);

      setBookings(bookings);
      setFilteredBookings(bookings);

      // Set highlights
      setHighlights([
        {
          id: '1',
          label: 'Jobs Completed',
          value: bookings
            .filter((task) => task.workStatus === 'Completed')
            .length.toString(),
        },
        {
          id: '2',
          label: 'Pending Requests',
          value: bookings
            .filter((task) => task.workStatus === 'Pending')
            .length.toString(),
        },
        { id: '3', label: 'Total Earnings', value: `${earnings}₹` },
        {
          id: '4',
          label: 'Average Rating',
          value: `${reviews.averageRating}/5`,
        },
      ]);
    } catch (error) {
      Alert.alert('Error fetching data:');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [route])
  );

  const getData = async (userId: string) => {
    const bookings = [];
    try {
      const response = await fetch(
        'https://loaclservicemarketplace-default-rtdb.firebaseio.com/users.json'
      );

      if (!response.ok) {
         Alert.alert('Somthing went wrong. Please try again.');
      }

      const allUsersData = await response.json();

      for (const customer in allUsersData) {
        const user = allUsersData[customer];
        if (user.bookings) {
          for (const bookingId in user.bookings) {
            const booking = user.bookings[bookingId];

            if (booking.serviceProviderId === userId) {
              bookings.push({
                id: bookingId,
                ...booking,
                customerName: user.fullName,
                customerEmail: user.email,
                customerPhone: user.phone,
                customerAddress: user.address,
              });
            }
          }
        }
      }
    } catch (error) {
        Alert.alert('Somthing went wrong. Please try again.');
    }

    const earningsData = await axios.get<Record<string, Earning>>(
      `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/earnings.json`
    );
    const totalEarnings = Object.values(earningsData.data || {}).reduce(
      (acc, earning) => acc + (earning.withdrawAmount || 0),
      0
    );

    const reviewsData = await axios.get<Record<string, Review>>(
      `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/reviews.json`
    );
    const totalReviews = Object.values(reviewsData.data || {}).length;
    const averageRating =
      totalReviews > 0
        ? (
            Object.values(reviewsData.data || {}).reduce(
              (acc, review) => acc + (review.reviewRating || 0),
              0
            ) / totalReviews
          ).toFixed(1)
        : '0';

    return {
      bookings,
      earnings: totalEarnings,
      reviews: { averageRating },
    };
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

  const onDateChange = (
    event: any,
    selectedDate: React.SetStateAction<null>
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFilterDate(selectedDate);
      filterBookingsByDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Highlights Section */}
      <View style={styles.highlightsContainer}>
        {highlights.map((item) => (
          <View key={item.id} style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>{item.label}</Text>
            <Text style={styles.highlightValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Date:</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.filterButtonText}>
            {filterDate ? filterDate.toLocaleDateString() : 'Select a Date'}
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

      {/* Ongoing Tasks Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ongoing Tasks</Text>
        {filteredBookings.length > 0 ? (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
                <Text style={styles.taskTitle}>{item.serviceName}</Text>
                <Text style={styles.taskClient}>
                  Client: {item.customerName}
                </Text>
                <Text style={styles.taskClient}>
                  Price: {`${item.price} ₹`}
                </Text>
                <Text style={styles.taskTime}>
                  {item.timeSlot} on {item.date}
                </Text>
                <Text style={styles.taskAddress}> Address: {`${item.customerAddress}`}</Text>
                <TouchableOpacity style={styles.taskButton}>
                  <Text style={styles.taskButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noTasksText}>No tasks found for this date.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  highlightCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  highlightLabel: {
    fontSize: 14,
    color: '#555',
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 5,
  },
  filterContainer: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  clearButton: {
    marginLeft: 10,
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskClient: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  taskTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  taskAddress: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  taskButton: {
    marginTop: 10,
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  taskButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noTasksText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default DashboardScreen;
