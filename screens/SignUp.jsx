// SignUp.js

import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TextInput, useWindowDimensions, Pressable, ActivityIndicator, ScrollView,TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STG} from '../fireBaseConfig';
import Logo from '../imgs/TIMELOGO.png';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { ref, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';


const SignUp = () => {
    const [name, setName] = useState('');
    const[userName,setUsername]= useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage,setSelectedImage] = useState(null);
    const navigation = useNavigation(); // Use useNavigation hook


    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;
    const stg = FIREBASE_STG;

 

    const handleImageSelection = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1
            });
            console.log(result); // Log the entire result object
            console.log('assts'+result.assets[0].uri)
            if (!result.cancelled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }
    
    }
  
       const uploadImageToStorage = async (selectedImage, userId) => {
    try {
        if (!selectedImage) {
            console.error('No image selected');
            return;
        }

        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const fileExtension = selectedImage.split('.').pop(); // Extract the file extension

        // Define the image name with the username included
        const imageName = `${userId}_profile_image.${fileExtension}`;
        
        // Define the folder path
        const folderPath = 'profile_pics/';

        // Combine folder path and image name
        const imagePath = folderPath + imageName;
        
        // Get a reference to the image in the specified folder
        const imageRef = storageRef(stg, imagePath);

        // Upload the image
        await uploadBytes(imageRef, blob);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(imageRef);
        console.log('Download URL:', downloadURL);

    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

    
    const handleSignUp = async () => {
        try {
            setLoading(true);
            const authResponse = await createUserWithEmailAndPassword(auth, email, password);
            console.log(authResponse);
    
    
            // Store user data including profile picture URL in the Realtime Database
            writeUserData(authResponse.user.uid, email, userName);
            uploadImageToStorage(selectedImage, authResponse.user.uid);
        } catch (error) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    
    
    const writeUserData = (userId, email, username) => {
        const userData = {
            email: email,
            username: username,
        };
    
        // Set user data in the Firebase Realtime Database
        set(ref(db, `users/${userId}`), userData)
            .then(() => {
                console.log('User data written successfully!');
            })
            .catch((error) => {
                console.error('Error writing user data: ', error);
            });
    };


    const { height } = useWindowDimensions();

    const validateAndSignUp = () => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        if (!email.trim()) {
            alert('Please enter your email');
            return;
        }

        // Email validation
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!password.trim()) {
            alert('Please enter a password');
            return;
        }

        if (!confirmPass.trim()) {
            alert('Please confirm your password');
            return;
        }

        if (password !== confirmPass) {
            alert('Passwords do not match');
            return;
        }

        // All validations passed, proceed with sign-up
        handleSignUp();
    };

    return (
        <ScrollView>
            <View style={styles.container}>
            <View style={styles.imageContainer}>

            <TouchableOpacity onPress={handleImageSelection}>
                        <Image
                        source={{ uri: selectedImage }}
                        style={{
                                height: 170,
                                width: 170,
                                borderRadius: 85,
                                borderWidth: 2,
                                borderColor: '#cbae73',
                            }}
                        />
                </TouchableOpacity>
                </View>
                <TextInput
                    value={name}
                    style={styles.input}
                    placeholder='Name'
                    autoCapitalize='words'
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                />
                 <TextInput
                    value={userName}
                    style={styles.input}
                    placeholder='Username'
                    autoCapitalize='none'
                    onChangeText={(text) => setUsername(text)}
                />
                <TextInput
                    secureTextEntry={true}
                    value={password}
                    style={styles.input}
                    placeholder='Password'
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                />

                <TextInput
                    secureTextEntry={true}
                    value={confirmPass}
                    style={styles.input}
                    placeholder='Confirm Password'
                    autoCapitalize='none'
                    onChangeText={(text) => setConfirmPass(text)}
                />
                <>
                    <Pressable style={styles.button} onPress={validateAndSignUp} disabled={loading}>
                        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                    </Pressable>
                    <Pressable style={styles.Button2} onPress={() => navigation.navigate('LogIn')}>
                        <Text style={styles.buttonText2}>Have an account? Sign In</Text>
                    </Pressable>
                </>
            </View>
        </ScrollView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
    },
    logo: {
        marginLeft: 30,
        width: '100%',
        maxWidth: 300,
        maxHeight: 300,
    },
    button: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#cbae73',
    },
    imageContainer: {
        alignItems: 'center', // Center the content horizontally
        marginBottom: 20, // Add some bottom margin for spacing
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#fff',
    },
    Button2: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    buttonText2: {
        fontWeight: 'bold',
        fontSize: 15,
    }
});
