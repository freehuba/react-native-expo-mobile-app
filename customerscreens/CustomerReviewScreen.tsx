import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const CustomerReviewScreen = ({ route, navigation }) => {
  const { serviceProviderId, serviceId } = route.params;
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [loading, setLoading] = useState(false);


  const handleRatingSelect = (rating: React.SetStateAction<number>) => {
    setReviewRating(rating);
  };

  // Function to handle the review submission
  const handleSubmitReview = async () => {
    if (!reviewMessage || reviewRating === 0) {
      Alert.alert('Please provide a message and a rating');
      return;
    }
    
    setLoading(true);

    const reviewData = {
      serviceId,
      reviewMessage,
      reviewRating,
      date: new Date().toLocaleString(), 
    };

    try {
      const response = await fetch(`https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${serviceProviderId}/reviews.json`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        Alert.alert('Failed to submit review');
      }

      Alert.alert('Your review has been submitted Successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Somthing went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave a Review</Text>
      <Text style={styles.label}>Review Message:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Write your review here..."
        multiline
        maxLength={200}
        value={reviewMessage}
        onChangeText={setReviewMessage}
      />
      <Text style={styles.charCount}>{`${reviewMessage.length}/200 characters`}</Text>

      <Text style={styles.label}>Rating:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingSelect(star)}
          >
            <Text style={[styles.star, reviewRating >= star ? styles.selectedStar : null]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitReview}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit Review'}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    fontSize: 16,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 36,
    color: '#ddd',
    marginHorizontal: 5,
  },
  selectedStar: {
    color: '#ffd700',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CustomerReviewScreen;
