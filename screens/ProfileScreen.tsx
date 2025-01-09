import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
ScrollView,
} from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';  

const ProfileScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 
  const { userId } = route.params;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user details from Firebase
  const fetchUserDetails = async () => {
    setLoading(true); 
    try {
      const response = await fetch(
        `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}.json`
      );

      if (!response.ok) {
        Alert.alert('Failed to fetch user details');
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details when the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchUserDetails();
    }
  }, [isFocused]);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userId, userDetails });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User details not found.</Text>
      </View>
    );
  }

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Perform API call to delete user data
              const response = await fetch(
                `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}.json`,
                {
                  method: 'DELETE',
                }
              );

              if (response.ok) {
                Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                navigation.navigate('RoleSelection'); 
              } else {
                Alert.alert('Failed to delete account. Please try again.');
              }
            } catch (error) {
                Alert.alert('Somthing went wrong. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Data for table columns
  const { fullName, email, phone, address, age, imageUri, role, pincode } = userDetails;
  const tableData = [
    ['Full Name', fullName],
    ['Email', email],
    ['Phone', phone],
    ['Address', address],
    ['Age', age],
    ['Role', role],
    ['Pincode', pincode],
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: imageUri }} style={styles.avatar} />
        <Text style={styles.username}>{fullName}</Text>
        <Text style={styles.userRole}>{role}</Text>
      </View>

      {/* Profile Table */}
      <View style={styles.tableContainer}>
        {tableData.map(([attribute, value], index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableText}>{attribute}</Text>
            <Text style={styles.tableText}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Delete Account Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Permanently Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userRole: {
    fontSize: 16,
    color: '#777',
  },
  tableContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  tableText: {
    textAlign: 'center',
    flex: 1,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
  },
    deleteButton: {
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'red',
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default ProfileScreen;
