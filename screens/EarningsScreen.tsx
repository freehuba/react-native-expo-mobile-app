import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
TextInput,
ScrollView,
} from "react-native";

const EarningsScreen = ({ route }) => {
  const {userId} = route.params;
  const [balance, setBalance] = useState(20000);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleWithdraw = () => {

    // Validation: Check if withdrawal amount is between 100 and 100000
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amount)) {
      Alert.alert("Please enter a valid amount to withdraw.");
      return;
    }
    if (amount < 100 || amount > 100000) {
      Alert.alert("Withdrawal amount must be between ₹100 and ₹100,000.");
      return;
    }

    if (amount > balance) {
      Alert.alert("Insufficient balance for the withdrawal.");
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert("Please select a payment method before withdrawing.");
      return;
    }

    const updatedBalance = balance - amount;
    setBalance(updatedBalance);

    // Data to send to Firebase
    const data = {
      paymentMethod: selectedPaymentMethod,
      balance: balance,
      withdrawAmount : amount,
      timestamp: new Date().toISOString(),
      description: `Withdrawn ₹${amount} via ${selectedPaymentMethod}`,

    };

    const firebaseUrl = `https://loaclservicemarketplace-default-rtdb.firebaseio.com/users/${userId}/earnings.json`;

    // Send data to Firebase 
    fetch(firebaseUrl, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert("Success", `Withdrawal initiated via ${selectedPaymentMethod}!`);
          setWithdrawAmount('');
        } else {
          Alert.alert('Somthing went wrong. Please try again.');
        }
      })
      .catch((error) => {
        Alert.alert('Somthing went wrong. Please try again.');
      });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Total Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>{balance}</Text>
        <Text style={styles.balanceLabel}>Total Balance</Text>
      </View>

      {/* Withdraw Amount Input */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={withdrawAmount}
        onChangeText={setWithdrawAmount}
        placeholder="Enter amount to withdraw"
      />

      {/* Withdraw Button */}
      <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
        <Text style={styles.withdrawButtonText}>Withdraw</Text>
      </TouchableOpacity>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.paymentMethodsLabel}>Select Payment Method</Text>

        {/* PhonePe Option */}
        <TouchableOpacity
          style={[
            styles.paymentMethod,
            selectedPaymentMethod === "PhonePe" && styles.selectedPaymentMethod,
          ]}
          onPress={() => setSelectedPaymentMethod("PhonePe")}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/1/11/PhonePe-Logo.png",
            }}
            style={styles.paymentIcon}
          />
          <Text style={styles.paymentText}>PhonePe</Text>
        </TouchableOpacity>

        {/* Google Pay Option */}
        <TouchableOpacity
          style={[
            styles.paymentMethod,
            selectedPaymentMethod === "Google Pay" && styles.selectedPaymentMethod,
          ]}
          onPress={() => setSelectedPaymentMethod("Google Pay")}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Google_Pay_%28GPay%29_Logo.svg/512px-Google_Pay_%28GPay%29_Logo.svg.png",
            }}
            style={styles.paymentIcon}
          />
          <Text style={styles.paymentText}>Google Pay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 20,
  },
  balanceContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  balanceText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4caf50",
  },
  balanceLabel: {
    fontSize: 18,
    color: "#555",
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "80%",
    padding: 10,
    fontSize: 18,
    marginTop: 20,
  },
  withdrawButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 30,
    elevation: 3,
  },
  withdrawButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  paymentMethodsContainer: {
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 10,
  },
  paymentMethodsLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },
  selectedPaymentMethod: {
    borderColor: "#4caf50",
    borderWidth: 2,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 15,
  },
  paymentText: {
    fontSize: 18,
    color: "#333",
  },
});

export default EarningsScreen;
