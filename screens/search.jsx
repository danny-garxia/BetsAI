import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import firebase from 'firebase';

const UserSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
        // Query the Firebase database for users matching the search query
        firebase.database().ref('users')
            .orderByChild('email')
            .startAt(searchQuery)
            .endAt(searchQuery + '\uf8ff')
            .once('value', snapshot => {
                if (snapshot.exists()) {
                    const users = Object.values(snapshot.val());
                    setSearchResults(users);
                } else {
                    setSearchResults([]);
                }
            })
            .catch(error => {
                console.error('Error searching for users:', error);
                setSearchResults([]);
            });
    };

    const addFriend = (userId) => {
        // Get the current user's ID
        const currentUser = firebase.auth().currentUser;
        const currentUserId = currentUser.uid;

        // Update the friends list for the current user in the database
        firebase.database().ref(`users/${currentUserId}/friends`)
            .push(userId) // Add the friend's ID to the friends list
            .then(() => {
                console.log('Friend added successfully!');
            })
            .catch(error => {
                console.error('Error adding friend:', error);
            });
    };

    return (
        <View>
            <TextInput
                placeholder="Search for users"
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
            />
            <Button title="Search" onPress={handleSearch} />
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.userId} // Assuming item.userId uniquely identifies each user
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.username}</Text>
                        <Button title="Add Friend" onPress={() => addFriend(item.userId)} />
                    </View>
                )}
            />
        </View>
    );
};

export default UserSearch;
