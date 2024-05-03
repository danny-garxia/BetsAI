import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, get } from 'firebase/database';
import { FIREBASE_AUTH,FIREBASE_DB,FIREBASE_STG } from '../fireBaseConfig';
import { ref as storageRef, getDownloadURL } from 'firebase/storage'; 
import { ScrollView } from 'react-native-gesture-handler';

const Community = () => {
    const [users, setUsers] = useState([]);
    const [imageURL, setImageURL] = useState({});
  
    const db = FIREBASE_DB;
    const stg = FIREBASE_STG;
    useEffect(() => {
      fetchUserData();
    }, []);
  
      const fetchUserData = async () => {
        try {
          const usersList = await getUsersList();
          setUsers(usersList);
          await fetchAndSetImageURLs(usersList);
            } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      const getUsersList = async () => {
        const usersRef = ref(db, 'posts');
        const usersSnapshot = await get(usersRef);
        const usersList = [];
        usersSnapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          usersList.push(userData);
        });
        return usersList;
      };
      const fetchAndSetImageURLs = async (usersList) => {
        const imageUrls = {}; // Object to store image URLs   
         await Promise.all(usersList.map(async (user) => {
        const imageURL = await fetchUploadedImage(user.userId);
         imageUrls[`${user.userId}`] = imageURL; // Store the imageURL directly in the imageUrls object
         }));
        usersList.forEach(user => {
          setImageURL(imageUrls);
        });
      };

  const fetchUploadedImage = async (userId) => {
    try {
      const imagePath = `profile_pics/${userId}_profile_image`;
      const jpgImageRef = storageRef(stg, `${imagePath}.jpg`);
      const pngImageRef = storageRef(stg, `${imagePath}.png`);
  
      const [jpgDownloadURL, pngDownloadURL] = await Promise.all([
        getDownloadURL(jpgImageRef).catch(error => null),
        getDownloadURL(pngImageRef).catch(error => null)
      ]);

      return jpgDownloadURL || pngDownloadURL; // Return the first available URL
    } catch (error) {
      console.error('Error fetching post image:', error);
      return null;
    }
  };
  
  const renderUserImage = (user) => {
      const imageUrl = imageURL[`${user.userId}`];
      if (imageUrl) {
        return (
          <>
            <Image source={{ uri: imageUrl }} style={styles.profilePicture} />
          </>
        );
      } else {
        return <Text>No image found</Text>;
      }
    
  };
    
      return (
        <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Display images for each user */}
          {users.map(user => (
            <View key={user.userId} style={styles.userContainer}>
              <TouchableOpacity style={styles.userTouchable}>
                {imageURL[user.userId] ? (
                  renderUserImage(user, imageURL[user.userId])
                ) : (
                  <Text>No image found</Text>
                )}
                <Text style={styles.username}>{user.username}</Text>

              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      
      );
    };
  
  const styles = StyleSheet.create({
    scrollView: {
    backgroundColor:'white',
      flex: 1,
    },
    container: {
      flex:1,
      alignItems: 'center',
    },
    userContainer: {
        flexDirection: 'row', // Align children horizontally
        alignItems: 'center', // Center the content vertically
        marginVertical: 10, // Adjust as needed
        width:'80%'
      },
      userTouchable: {
        flexDirection: 'row', // Align children horizontally
        alignItems: 'center', // Center the content vertically

      },
     
    profilePicture: {
      width: 55,
      height: 55,
      borderRadius: 35,
      marginRight: 70,
      
    },
    username: {
      textAlign: 'left',
      fontSize: 24,
      fontWeight: 'bold',
      margin: 15
    },
  
   
  });

export default Community;
