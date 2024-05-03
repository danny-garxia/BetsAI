import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ref, get, child } from 'firebase/database';
import { FIREBASE_DB, FIREBASE_STG } from '../fireBaseConfig';
import { getDownloadURL, ref as storageRef } from "firebase/storage";

const Community = () => {
    const [users, setUsers] = useState([]);
    const db = FIREBASE_DB;
    const stg = FIREBASE_STG;
    const currentUserID = "your_current_user_id"; // Replace "your_current_user_id" with the actual ID of the current user

    useEffect(() => {
        fetchUserData();
        fetchUserIDs();
    }, []);

    const fetchUserData = async () => {
        try {
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);
            const usersList = [];
            usersSnapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.userId !== currentUserID) { // Exclude the current user
                    usersList.push(userData);
                }
            });
            setUsers(usersList);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserIDs = async () => {
        try {
            // Reference the location in the database where user IDs are stored
            const userIDsRef = ref(FIREBASE_DB, 'userIDs');
            // Get the data from the userIDsRef
            const snapshot = await get(userIDsRef);
            // Initialize an array to store user IDs
            const userIDs = [];
            // Iterate through the snapshot to extract user IDs
            snapshot.forEach((childSnapshot) => {
                // Push each user ID to the userIDs array
                const userId = childSnapshot.key; // Assuming user IDs are stored as keys
                if (userId !== currentUserID) { // Exclude the current user
                    userIDs.push(userId);
                    // Fetch profile image for the current user ID
                    fetchProfileImage(userId);
                }
            });
            // Return the array of user IDs
            return userIDs;
        } catch (error) {
            console.error('Error fetching user IDs:', error);
            return []; // Return an empty array in case of error
        }
    };

    const fetchProfileImage = async (userID) => {
        try {
            // Construct the imrage name based on the userId
            const imageName = `${userID}_profile_image`;
            // Check for both JPG and PNG extensions
            const jpgImageRef = storageRef(stg, `profile_pics/${imageName}.jpg`);
            const pngImageRef = storageRef(stg, `profile_pics/${imageName}.png`);
console.log(`User Id is ${userID}`)
            try {
                const jpgDownloadURL = await getDownloadURL(jpgImageRef);
                return jpgDownloadURL; // Return the download URL if JPG image is found
            } catch (jpgError) {
                try {
                    const pngDownloadURL = await getDownloadURL(pngImageRef);
                    return pngDownloadURL; // Return the download URL if PNG image is found
                } catch (pngError) {
                    console.error('Error fetching profile image: Image not found for the user.');
                    return null; // Return null if neither JPG nor PNG image is found
                }
            }
        } catch (error) {
            console.error('Error fetching profile image:', error);
            return null; // Return null in case of any error
        }
    };

    const renderUserItem = ({ item }) => (
        <TouchableOpacity style={styles.userItem}>
            <Image source={{ uri: item.profile_picture_url }} style={styles.profilePicture} />
            <Text style={styles.username}>{item.username}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.userId} // Use a unique identifier for each user
                ListEmptyComponent={<Text>No users found</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Community;
