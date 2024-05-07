import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ref, child, onValue, push, set } from 'firebase/database'; // Firebase imports
import { FIREBASE_DB } from '../fireBaseConfig'; // Assuming your config file

const Chat = ({ route }) => {
  /*const { userId } = route.params; // Get userId from navigation params
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const dbRef = ref(child(FIREBASE_DB, `chats/${userId}`));
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMessages(Object.values(data)); // Convert object to message array
    });

    return unsubscribe; // Cleanup function to prevent memory leaks
  }, [userId]);

  const sendMessage = () => {
    if (!messageText) return; // Handle empty message

    const message = {
      sender: 'currentUser', // Replace with actual user logic
      content: messageText,
      timestamp: Date.now(), // Add timestamp
    };

    const dbRef = ref(child(FIREBASE_DB, `chats/${userId}`));
    push(dbRef, message); // Push message to Firebase

    setMessageText(''); // Clear message input after sending
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === 'currentUser' ? styles.myMessage : styles.otherMessage}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.timestamp.toString()}
      />
      <View style={styles.messageInput}>
        <TextInput
          style={styles.messageInputBox}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );*/
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    scrollView: {
        flex: 1,
    },
    conversationContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    conversationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    messagesContainer: {
        maxHeight: 200,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
});

export default Chat;
