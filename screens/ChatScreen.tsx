import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const baseUrl = "https://loaclservicemarketplace-default-rtdb.firebaseio.com/messages";

const ChatScreen = ({ route }) => {
  const userRole = route.params.role;
  const customerId = '-OCXpSirtw4HyRGhnbQm';
  const serviceProviderId = '-OCXj9h4bP8uRYqG8fda';
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const chatRoomKey = `${customerId}_${serviceProviderId}`;  
  const firebaseUrl = `${baseUrl}/${chatRoomKey}.json`;


  // Fetch messages from Firebase when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        if (data) {
          const fetchedMessages = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Real-time message update (polling every 2 seconds)
    const interval = setInterval(fetchMessages, 2000);  // Polling to simulate real-time updates
    return () => clearInterval(interval);
  }, []);

  // Send a message to Firebase
  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: userRole, // either 'customer' or 'service_provider'
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(firebaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Render each chat message
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === userRole;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Input field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    justifyContent: "flex-end",
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4caf50",
    borderTopRightRadius: 0,
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChatScreen;
