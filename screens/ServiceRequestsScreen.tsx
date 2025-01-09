import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
Alert,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native'; 
import { formatRequestId } from "../validation";


const ServiceRequestsScreen: React.FC = ({ route }) => {

  const  currentUserId  = route.params.userId;
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://loaclservicemarketplace-default-rtdb.firebaseio.com/users.json');
      
      if (!response.ok) {
        Alert.alert('Somthing went wrong. Please try again.');
      }

      const allUsersData = await response.json();
      const filteredBookings = [];

      for (const userId in allUsersData) {
        const user = allUsersData[userId];
        if (user.bookings) {
          for (const bookingId in user.bookings) {
            const booking = user.bookings[bookingId];

            if (booking.serviceProviderId === currentUserId) {
              filteredBookings.push({
                id: bookingId,
                ...booking,
                customerName: user.fullName,
                customerEmail: user.email,
                customerPhone: user.phone,
              });
            }
          }
        }
      }

      setBookings(filteredBookings);
    } catch (error) {
      Alert.alert('Error fetching data');
    }
  };

  // Refetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleStatusChange = async (bookingId: string, newStatus: string, customerId: string) => {
  try {
    // Firebase endpoint URL
    const url = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${customerId}/bookings/${bookingId}.json`;
    
    // Perform the PATCH request to update workStatus
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workStatus: newStatus }), 
    });

    if (!response.ok) {
      Alert.alert('Failed to update workStatus');
    }
    
    fetchData();
  } catch (error) {
    Alert.alert('Somthing went wrong. Please try again.');
  }
};


  return (
    <ScrollView style={styles.container}>
      {/* Service Requests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requests</Text>
        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Request ID: {formatRequestId(index)}</Text>
                  <Text
                    style={[
                      styles.cardStatus,
                      item.workStatus === "Pending"
                        ? styles.statusPending
                        : item.workStatus === "Accepted"
                        ? styles.statusAccepted
                        : item.workStatus === "Rejected"
                        ? styles.statusRejected
                        : item.workStatus === "In Progress"
                        ? styles.statusInProgress
                        : styles.statusCompleted,
                    ]}
                  >
                    {item.workStatus}
                  </Text>
                </View>
                <Text style={styles.cardClient}>Client: {item.customerName}</Text>
                <Text style={styles.cardService}>Service: {item.serviceName}</Text>
                <Text style={styles.cardService}>Price: {`${item.price} ₹`}</Text>
                <Text style={styles.cardDate}>Time: {item.timeSlot}</Text>
                <Text style={styles.cardDate}>Date: {item.date}</Text>
                <View style={styles.actions}>
                  {item.workStatus === "Pending" && (
                    <>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleStatusChange(item.id, "Accepted",item.userId)}
                      >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleStatusChange(item.id, "Rejected",item.userId)}
                      >
                        <Text style={styles.rejectButtonText}>Reject</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {item.workStatus === "Accepted" && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleStatusChange(item.id, "In Progress",item.userId)}
                    >
                      <Text style={styles.actionButtonText}>Start</Text>
                    </TouchableOpacity>
                  )}
                  {item.workStatus === "In Progress" && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleStatusChange(item.id, "Completed",item.userId)}
                    >
                      <Text style={styles.actionButtonText}>Complete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => console.log(`View details for ${item.id}`)}
                  >
                    <Text style={styles.secondaryButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noRequestsText}>No service requests available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#fff",
  },
  statusPending: {
    backgroundColor: "#f57c00",
  },
  statusAccepted: {
    backgroundColor: "#4caf50",
  },
  statusRejected: {
    backgroundColor: "#f44336",
  },
  statusInProgress: {
    backgroundColor: "#0288d1",
  },
  statusCompleted: {
    backgroundColor: "#388e3c",
  },
  cardClient: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  cardService: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  rejectButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#0288d1",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  secondaryButtonText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "bold",
  },
  noRequestsText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ServiceRequestsScreen;
