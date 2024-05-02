
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, Text, StyleSheet, TextInput, useWindowDimensions, Pressable, ActivityIndicator, ScrollView,TouchableOpacity } from 'react-native';
import { FIREBASE_STR } from '../fireBaseConfig';
import { addDoc } from 'firebase/firestore';

const Message = async () => {
//  const fbStre = FIREBASE_STR;
// const [messages, setMessages] = useState('');

//  const me
// const onText =()=>{
// if(messages === '') return;

// await addDoc()


// };

return(
    <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
 <TextInput 
                style={styles.input}
                value={messages}
                placeholder="Start message.."
                placeholderTextColor={'black'}
                onChangeText={(text)=>setMessages(text)}
                       />
    </View>
    <View style={styles.button}>
                    <TouchableOpacity onPress={onText}>
                        <Text style={styles.buttonText}>Send Capsule To Comunity Member </Text>
                    </TouchableOpacity>
                </View>
    </ScrollView>
)
};

const styles =StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 90,
      },
      button: {
        width: '80%',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderColor: 'black', 
        borderWidth:3,
        borderRadius:9,
        backgroundColor: 'rgba(203, 174, 115, .7)',
    },
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        paddingHorizontal: 10,
        marginRight: 10,
    }
})

export default Message;
