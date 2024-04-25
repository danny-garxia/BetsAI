import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput , TouchableOpacity} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../fireBaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ref, get } from "firebase/database";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_DB } from '../fireBaseConfig';
import { FIREBASE_STG } from '../fireBaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}


const ProfileSett = ({ navigation }: RouterProps) => {
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [userName, setUserName] = useState('');

    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;
    const stg = FIREBASE_STG;

    useEffect(() => {
        fetchUserName();
        fetchProfileImage();
    }, []);

    const fetchUserName = async () => {
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userId = user.uid;
                const snapshot = await get(ref(FIREBASE_DB, `users/${userId}/username`));
                const fetchedUserName = snapshot.val();
                if (fetchedUserName) {
                    setUserName(fetchedUserName);
                } else {
                    console.log('Username not found for the user.');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchProfileImage = async () => {
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userId = user.uid; // Define userId here
                // Construct the image name based on the userId
                const imageName = `${userId}_profile_image`;
                // Check for both JPG and PNG extensions
                const jpgImageRef = storageRef(stg, `profile_pics/${imageName}.jpg`);
                const pngImageRef = storageRef(stg, `profile_pics/${imageName}.png`);
    
                try {
                    const jpgDownloadURL = await getDownloadURL(jpgImageRef);
                    setProfilePictureUrl(jpgDownloadURL);
                    return;
                } catch (jpgError) {
                    try {
                        const pngDownloadURL = await getDownloadURL(pngImageRef);
                        setProfilePictureUrl(pngDownloadURL);
                        return;
                    } catch (pngError) {
                        console.error('Error fetching profile image: Image not found for the user.');
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    };
    
    

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.cancelled) {
                const userId = 'the_user_id'; // Replace with the actual user ID
                const response = await fetch(result.uri);
                const blob = await response.blob();
                const storageRef = storageRef(FIREBASE_STG).child(`profilePictures/${userId}_profile_image.png`);
                await storageRef.put(blob);
                const downloadURL = await storageRef.getDownloadURL();
                await ref(FIREBASE_DB, `users/${userId}/profilePictureUrl`).set(downloadURL);
                setProfilePictureUrl(downloadURL);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <SafeAreaView style={styles.SafeAC}>
            <View style={styles.container}>
                <Pressable style={styles.GoBack} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="black" />
                </Pressable>
                <Text style={styles.text1}>Profile Settings</Text>
            </View>
            <ScrollView>
                <View style={styles.container}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={{ uri: profilePictureUrl }}
                            style={{
                                height: 170,
                                width: 170,
                                borderRadius: 85,
                                borderWidth: 2,
                                borderColor: '#cbae73'
                            }}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 10,
                            zIndex: 9999
                        }}>
                            <MaterialIcons
                                name='photo-camera'
                                size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: "column",
                    marginBottom: 6
                }}>
                    <Text style={styles.SettingText}>Name</Text>
                    <View style={{
                        height: 44,
                        width: "100%",
                        borderColor: 'black',
                        borderRadius: 4,
                        borderWidth: 1,
                        marginVertical: 6,
                        justifyContent: 'center',
                        paddingLeft: 8,
                    }}>
                        <TextInput
                            value={userName}
                            onChangeText={setUserName}
                        />
                    </View>
                    <Pressable style={styles.Button1} onPress={() => FIREBASE_AUTH.signOut()} >
                        <Text style={styles.buttonText}>Log out</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 22,
    },
    Button1: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 6,
        fontWeight: 'bold',
        fontSize: 30,
        backgroundColor: '#cbae73',
    },
    SafeAC: {
        flex: 1,
        paddingHorizontal: 22,
    },
    GoBack: {

    },
    text1: {
        marginHorizontal: 10,
        paddingTop: 3,
        alignContent: "center",
    },
    SettingText: {
        fontSize: 10,
        fontWeight: 'bold'
    }
});
export default ProfileSett;
