
// SignUp.js

import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TextInput, useWindowDimensions, Pressable, ActivityIndicator, ScrollView,TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STG} from '../fireBaseConfig';
import Logo from '../imgs/TIMELOGO.png';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { ref, set,get } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';


const Post = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [years, setYears] = useState('');
    const [days, setDays] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [userName, setUserName] = useState('');

    const navigation = useNavigation(); // Use useNavigation hook

    useEffect(() => {
        fetchUserName();
    }, []);

    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;
    const stg = FIREBASE_STG;

    const fetchUserName = async () => {
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userId = user.uid;
                const snapshot = await get(ref(FIREBASE_DB, `users/${userId}/username`));
                const fetchedUserName = snapshot.val();
                if (fetchedUserName) {
                    setUserName(fetchedUserName); // Set the fetched username in the state
                } else {
                    console.log('Username not found for the user.');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleImageSelection = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1
            });
            if (!result.cancelled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }
    };

    const uploadImageToStorage = async () => {
        try {
            if (!selectedImage) {
                console.error('No image selected');
                return;
            }
    
            // Fetch the current user ID
            const userId = FIREBASE_AUTH.currentUser.uid;
    
            // Fetch the current post number from the database
            const postNumberSnapshot = await get(ref(db, `users/${userId}/postNumber`));
            let postNumber = postNumberSnapshot.val() || 0; // If postNumberSnapshot is null, default to 0
    
            // Increment the post number
            postNumber++;
    
            // Write the updated post number back to the database
            await set(ref(db, `users/${userId}/postNumber`), postNumber);
    
            // Use the incremented post number as part of the post name
            const postName = `post_${postNumber}`;
    
            // Continue with image upload as before
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            const fileExtension = selectedImage.split('.').pop(); // Extract the file extension
    
            const imageName = `${userId}_${postName}_image.${fileExtension}`;
            const folderPath = 'User_Posts/';
            const imagePath = folderPath + imageName;
            const imageRef = storageRef(stg, imagePath);
    
            // Upload the image
            await uploadBytes(imageRef, blob);
    
            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(imageRef);
            console.log('Download URL:', downloadURL);
    
            // Call writeUserData with all required parameters
            writeUserData(userId, userName, years, days, hours, minutes, postName);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    

    const writeUserData = (userId, username, years, days, hours, minutes, postName) => {
        const userData = {
            username: username,
            years: years,
            days: days,
            hours: hours,
            minutes: minutes,
            postName: postName // Include postName data in the userData object
        };
    
        // Set user data in the Firebase Realtime Database under the "posts" table
        set(ref(db, `posts/${userId}`), userData)
            .then(() => {
                console.log('User data written successfully!');
            })
            .catch((error) => {
                console.error('Error writing user data: ', error);
            });
    };
    
    

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={handleImageSelection} style={selectedImage ? styles.buttonWithImage : styles.button}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
                        ) : (
                            <Text style={styles.buttonText}>Post</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.button2}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={years}
                            style={styles.input}
                            placeholder="Years"
                            onChangeText={(text) => setYears(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            value={days}
                            style={styles.input}
                            placeholder="Days"
                            onChangeText={(text) => setDays(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            value={hours}
                            style={styles.input}
                            placeholder="Hours"
                            onChangeText={(text) => setHours(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            value={minutes}
                            style={styles.input}
                            placeholder="Minutes"
                            onChangeText={(text) => setMinutes(text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <Text style={styles.buttonText}>Time</Text>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={uploadImageToStorage}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Center the content vertically
        marginTop: '50%'
    },
    button: {
        width: '80%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#cbae73',
        marginTop: 10
    },
    button2: {
        marginTop: 10,
        width: '80%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#cbae73'
    },
    imageContainer: {
        alignItems: 'center', // Center the content horizontally
        width: '100%',
        marginTop: '50%'
    },
    buttonWithImage: {
        backgroundColor: 'transparent', // No background color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#fff'
    },
    inputContainer: {
        flexDirection: 'row', // Change from 'column' to 'row'
        marginBottom: 20,
        marginLeft: 10
    },
    input: {
        paddingHorizontal: 10,
        marginRight: 10
    }
});
export default Post;
