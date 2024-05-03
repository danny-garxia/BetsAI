
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, Text, StyleSheet, TextInput, useWindowDimensions, Pressable, ActivityIndicator, ScrollView,TouchableOpacity } from 'react-native';
import { FIREBASE_STR,FIREBASE_AUTH } from '../fireBaseConfig';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';



const Message = () => {
const fbStre = FIREBASE_STR;
const auth = FIREBASE_AUTH;
const [newMessages, setNewMessages] = useState('');
const [messages,setMessages] = useState([]);


useEffect(()=>{

    const fetchConversations = async () => {
        const messageRef = collection(fbStre, "messages");
        const qurryMessages = query(messageRef, where('users', 'array-contains', auth.currentUser.uid));
        const unsubscribe = onSnapshot(qurryMessages, (snapshot) => {
            const messageData = [];
            snapshot.forEach((doc) => {
                messageData.push({...doc.data(), id: doc.id});
            });
            setMessages(messageData);
        });
        return () => unsubscribe();
    };

    fetchConversations();
},[]);


const sendMessage = async (messageID) => {
    if (newMessages.trim() === '') return;

    const messagesRef = collection(fbStre, `messages/${messageID}`);
    await addDoc(messagesRef, {
        text: newMessages,
        createdAt: serverTimestamp(),
        sender: auth.currentUser.uid,
    });
    setNewMessages('');
};

return (
    <ScrollView style={styles.scrollView}>
        <Text> Hello</Text>
        {messages.map((message) => (
            <View key={message.id} style={styles.conversationContainer}>
                <Text style={styles.conversationTitle}>Conversation with {message.otherUser}</Text>
                <ScrollView style={styles.messagesContainer}>
                    <View key={message.id}>
                        <Text>{message.text}</Text>
                    </View>
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newMessages}
                        onChangeText={(text) => setNewMessages(text)}
                        placeholder="Type your message..."
                    />
                    <TouchableOpacity onPress={() => sendMessage(message.id)}>
                        <Text>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ))}
    </ScrollView>
);

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
        borderBottomColor: 'back',
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


export default Message;




