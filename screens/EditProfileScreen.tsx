import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; 
import { useNavigation, useRoute } from '@react-navigation/native';

interface EditProfileScreenProps {
  route: {
    params: {
      userId: string;
      userDetails: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        age: number;
        imageUri: string;
        role: string;
        pincode: string;
      };
    };
  };
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = () => {
  const { params } = useRoute();
  const { userId, userDetails } = params;
  const { fullName, email, phone, address, age, imageUri, pincode } = userDetails;

  const [name, setName] = useState(fullName);
  const [emailInput, setEmail] = useState(email);
  const [phoneInput, setPhone] = useState(phone);
  const [addressInput, setAddress] = useState(address);
  const [ageInput, setAge] = useState(age.toString());
  const [pincodeInput, setPincode] = useState(pincode);
  const [profileImage, setProfileImage] = useState(imageUri);

  const navigation = useNavigation();

  const handleImageChange = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Somthing went wrong. Please try again.');
      } else {
        const selectedImageUri = response.assets[0].uri;
        setProfileImage(selectedImageUri);
      }
    });
  };

const handleSave = async () => {
  const updatedDetails = {
    fullName: name,
    email: emailInput,
    phone: phoneInput,
    address: addressInput,
    age: ageInput,
    pincode: pincodeInput,
    imageUri: profileImage,
  };

  try {
    const response = await fetch(
      `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDetails),
      }
    );

    if (!response.ok) {
       Alert.alert('Somthing went wrong. Please try again.');
    }

    const result = await response.json();
    Alert.alert('Success', 'Profile updated successfully!');

    // Navigate back 
    navigation.goBack();
  } catch (error) {
    Alert.alert('Could not update profile. Please try again.');
  }
};


  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImageChange}>
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.username}>Edit Profile</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={emailInput}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phoneInput}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={addressInput}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={ageInput}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          value={pincodeInput}
          onChangeText={setPincode}
          keyboardType="numeric"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
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
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 13,
    marginVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EditProfileScreen;
