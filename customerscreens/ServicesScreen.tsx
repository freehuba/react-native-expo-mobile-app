import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, Platform, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { formatDate, generateTimeSlots } from '../validation';


interface Service {
  serviceId: string;
  name: string;
  description: string;
  price: string;
}

interface UnavailableSlot {
  slotId: string;
  date: string;
  timeSlot: string;
}

interface ServiceProvider {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  age: string;
  pincode: string;
  services: Service[];
  unavailableSlots: UnavailableSlot[];
}

const ServiceProvidersScreen: React.FC<{ userId: string }> = ({ route }) => {
  const { userId } = route.params;
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<string>(''); 
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); 
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false); 
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');


  const fetchServiceProviders = async () => {
    try {
      const response = await fetch('https://loaclservicemarketplace-default-rtdb.firebaseio.com/users.json');
      const data = await response.json();

      // Filter out users with the role "service_provider"
      const filteredProviders: ServiceProvider[] = [];
      for (const key in data) {
        if (data[key].role === 'service_provider') {
          filteredProviders.push({
            id: key,
            fullName: data[key].fullName,
            email: data[key].email,
            phone: data[key].phone,
            role: data[key].role,
            address: data[key].address,
            age: data[key].age,
            pincode: data[key].pincode,
            services: data[key].services
              ? Object.keys(data[key].services).map((serviceKey) => ({
                  serviceId: serviceKey, 
                  ...data[key].services[serviceKey], 
                }))
              : [],
            unavailableSlots: data[key].unavailableSlots
              ? Object.keys(data[key].unavailableSlots).map((slotKey) => ({
                  slotId: slotKey,
                  ...data[key].unavailableSlots[slotKey], 
                }))
              : [],
          });
        }
      }

      //fitering who having the services atleast 1
        const filteredWithServices = filteredProviders.filter(provider => 
        provider.services && provider.services.length > 0
      );

      setServiceProviders(filteredWithServices);
      setFilteredProviders(filteredWithServices);
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    }
  };

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  // Filter providers based on address match
  const handleSearch = (searchQuery: string) => {
    const query = searchQuery.trim();
    setSearchQuery(query);
    if (query) {
      const filtered = serviceProviders.filter((provider) =>
        provider.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProviders(filtered);
    } else {
      setFilteredProviders(serviceProviders); 
    }
  };

  // Handle selecting the date
  const handleDateSelect = (date: string) => {
    const newDate = formatDate(date);
    setSelectedDate(newDate);
    setDatePickerVisibility(false);
    filterAvailableTimeSlots(newDate);
  };

  // Handle selecting the time slot
  const handleTimeSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setTimePickerVisibility(false);
  };

  // Filter available time slots based on selected date
  const filterAvailableTimeSlots = (date: string) => {
    const unavailableSlots = serviceProviders.flatMap(provider => provider.unavailableSlots);
    const unavailableOnSelectedDate = unavailableSlots.filter(slot => slot.date === date);

    const allTimeSlots = generateTimeSlots(); 
    const availableTimeSlots = allTimeSlots.filter(timeSlot => 
      !unavailableOnSelectedDate.some(slot => slot.timeSlot === timeSlot)
    );
      setAvailableTimeSlots(availableTimeSlots);
    };

  // Handle booking service
  const handleBookService = async (
    serviceId: string,
    serviceName: string,
    serviceProviderName: string,
    price: string,
    serviceProviderId: string
  ) => {
    if (!paymentMode) {
      Alert.alert('Please select a payment mode before booking.');
      return; // Prevent booking if no payment mode is selected
    }
    if (!selectedDate || !selectedTimeSlot) {
      Alert.alert('Please select a date and time slot before booking.');
      return; // Prevent booking if date or time is not selected
    }

    setStatus('Booked'); 

    const bookingData = {
      serviceId,
      userId,
      serviceName,
      serviceProviderName,
      serviceProviderId,
      price,
      status: 'Booked', 
      paymentMode, 
      paymentStatus: 'Success', 
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      workStatus: 'Pending'
    };

    try {
      const response = await fetch(`https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/bookings.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        Alert.alert('Failed to book the service');
      }

      Alert.alert('Service Booked', 'Your service has been booked successfully.');
      // Clear the selected date and time after booking
      setSelectedDate('');
      setSelectedTimeSlot('');
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <ScrollView style={styles.container}>

      <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Location"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#B0B0B0" 
      />
    </View>

      {/* Payment Mode Selection */}
      <View style={styles.paymentModeSection}>
        <Text style={styles.paymentModeText}>Select Payment Mode</Text>
        <View style={styles.paymentButtons}>
          {['Cash', 'PhonePe', 'Google Pay'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.paymentButton,
                paymentMode === mode && styles.selectedPaymentButton,
              ]}
              onPress={() => setPaymentMode(mode)}
            >
              <Text style={styles.paymentButtonText}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date Selection */}
      <View style={styles.dateSelection}>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <View style={styles.dateButton}>
            <Icon name="calendar" size={20} color="#fff" />
            <Text style={styles.dateButtonText}>
              {selectedDate ? `Selected Date: ${selectedDate}` : 'Select Date'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Time Slot Selection */}
      <View style={styles.timeSlotSection}>
        {selectedDate ? (<Text style={styles.paymentModeText}>Select Time Slot</Text>):''}
        <View style={styles.timeSlotButtons}>
          {availableTimeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.paymentButton,
                selectedTimeSlot === time && styles.selectedPaymentButton,
              ]}
              onPress={() => handleTimeSelect(time)}
            >
              <Text style={styles.paymentButtonText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Service booking Section */}
      <View style={styles.section}>
        {filteredProviders.length > 0 ? (
          <FlatList
            data={filteredProviders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.providerCard}>
                <Text style={styles.providerName}>Provider: {item.fullName}</Text>
                {/* Render each service of this provider */}
                {item.services.map((service) => (
                  <View key={service.serviceId} style={styles.serviceCard}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                    <Text style={styles.servicePrice}>₹ {service.price}</Text>
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() =>
                        handleBookService(
                          service.serviceId,
                          service.name,
                          item.fullName,
                          service.price,
                          item.id 
                        )
                      }
                    >
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          />
        ) : (
          <Text>No service providers found.</Text>
        )}
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateSelect}
        onCancel={() => setDatePickerVisibility(false)}
      />

      {/* Time Picker Modal */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeSelect}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f4f7fc',
  },
  paymentModeSection: {
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  paymentModeText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#34495e',
  },
  paymentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
 paymentButton: {
  paddingVertical: 12,
  paddingHorizontal: 10, 
  backgroundColor: '#ecf0f1',
  borderRadius: 8,
  width: '28%', 
  alignItems: 'center',
  shadowColor: '#bdc3c7',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
},
  selectedPaymentButton: {
    backgroundColor: '#2980b9',
  },
  paymentButtonText: {
    color: '#34495e',
    fontSize: 16,
    fontWeight: '600',
  },
  dateSelection: {
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#2980b9',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#bdc3c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  timeSlotSection: {
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  timeSlotButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
    section: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#bdc3c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginVertical: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2980b9',
  },
  bookButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2980b9',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#bdc3c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  providerCard: {
    marginBottom: 30,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },searchContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
    fontSize: 16,
    color: '#333', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    elevation: 2, 
  },
});


export default ServiceProvidersScreen;
