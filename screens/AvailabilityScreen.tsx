import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { defineHours12HourFormat, generateNext10Days } from '../validation';

interface UnavailableSlot {
  id: string;
  date: string;
  timeSlot: string;
}

const AvailabilityScreen = ({ route }) => {
  const { userId } = route.params; 
  const [unavailableSlots, setUnavailableSlots] = useState<UnavailableSlot[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const firebaseUrl = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/unavailableSlots.json`;

  // Define the hours in 12-hour format
  const hours = defineHours12HourFormat();

  useEffect(() => {
  // Generate the next 10 days with dd-mm-yyyy format
    setDates(generateNext10Days());
    fetchUnavailableSlots();
  }, []);

  // Fetch unavailable slots from Firebase
  const fetchUnavailableSlots = async () => {
    try {
      const response = await fetch(firebaseUrl);
      const data = await response.json();
      const slots = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));
      setUnavailableSlots(slots);
    } catch (error) {
      Alert.alert('Failed to fetch unavailable slots.');
    }
  };

  // Add or update unavailable slot
  const handleSlotPress = async (date: never, timeSlot: string) => {
    const existingSlot = unavailableSlots.find(
      (slot) => slot.date === date && slot.timeSlot === timeSlot
    );

    if (existingSlot) {
      // Slot already unavailable, ask to remove
      Alert.alert(
        'Slot Already Unavailable',
        `Would you like to make this slot available again?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Make Available',
            onPress: () => deleteUnavailableSlot(existingSlot.id),
          },
        ]
      );
    } else {
      // Mark slot as unavailable
      const newSlot = { date, timeSlot };
      try {
        const response = await fetch(firebaseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSlot),
        });

        if (!response.ok)  Alert.alert('Somthing went wrong. Please try again.');

        const data = await response.json();
        setUnavailableSlots((prev) => [...prev, { id: data.name, ...newSlot }]);
      } catch (error) {
        Alert.alert('Somthing went wrong. Please try again.');
      }
    }
  };

  // Delete unavailable slot
  const deleteUnavailableSlot = async (slotId: any) => {
    const deleteUrl = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/unavailableSlots/${slotId}.json`;
    try {
      const response = await fetch(deleteUrl, { method: 'DELETE' });
      if (!response.ok)   Alert.alert('Somthing went wrong. Please try again.');

      setUnavailableSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove slot.');
    }
  };

  // Render Grid
  const renderGrid = () => {
    return hours.map((timeSlot, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        <Text style={styles.timeLabel}>{timeSlot}</Text>
        {dates.map((date, colIndex) => {
          const isUnavailable = unavailableSlots.some(
            (slot) => slot.date === date && slot.timeSlot === timeSlot
          );
          return (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.cell,
                isUnavailable && styles.unavailableCell,
              ]}
              onPress={() => handleSlotPress(date, timeSlot)}
            >
              {isUnavailable && <Text style={styles.unavailableText}>Busy</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <ScrollView horizontal>
      <View>
        {/* Column Headers */}
        <View style={styles.columnHeader}>
          <Text style={styles.timeLabel}></Text>
          {dates.map((date, index) => (
            <Text key={index} style={styles.dateLabel}>
              {date}
            </Text>
          ))}
        </View>
        {/* Grid */}
        <ScrollView>{renderGrid()}</ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  columnHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
  },
  dateLabel: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    width: 120,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    height: 40,
    width: 80,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  unavailableCell: {
    backgroundColor: '#ffcccc',
  },
  unavailableText: {
    color: '#ff0000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 14,
    overflow: 'hidden',
  },
});

export default AvailabilityScreen;
