import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore'; // Firebase imports
import { auth, database } from '../config/firebase'; // Assuming your config file

/*const Chat = ({ route }) => {
  const { userId } = route.params; // Get userId from navigation params
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
  );
};*/

export default function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );
    });

    return () => unsubscribe();
  }, []);


const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];    
    addDoc(collection(database, 'chats'), {
      _id,
      createdAt,
      text,
      user
    });
  }, []);
  return (
    <GiftedChat 
    messages={messages}
    showAvatarForEveryMessage={true}
    onSend={messages => onSend(messages)}
    user={{
      _id: auth?.currentUser?.email,
      avatar: ''
    }} 
    
    
    />
  )
}

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

//export default Chat;
