import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { ref, get } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage'; // Import storageRef and getDownloadURL from Firebase Storage
import { FIREBASE_DB } from './fireBaseConfig';
import { FIREBASE_STG } from './fireBaseConfig';
import staticImage from './imgs/static.jpg';
import { ScrollView } from 'react-native-gesture-handler';

const EncryptImage = () => {
  const [users, setUsers] = useState([]);
  const [imageURL, setImageURL] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const db = FIREBASE_DB;
  const stg = FIREBASE_STG;
  useEffect(() => {
    fetchUserData();
    generateEncryptionKey();
    
    // Update currentTime every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [imageURL]);


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
      const usersRef = ref(FIREBASE_DB, 'posts');
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
      const imageURL = await fetchUploadedImage(user.userId, user.postName);
       imageUrls[`${user.userId}_${user.postName}`] = imageURL; // Store the imageURL directly in the imageUrls object
       }));
    

      usersList.forEach(user => {
        setImageURL(imageUrls);
        generateEncryptionKey(user.userId, user.minutes, user.hours, user.years, user.days, user.timestamp);
      });
    
    };
    
  
const fetchUploadedImage = async (userId, postName) => {
  try {
    const imageName = `${userId}_${postName}`;
    const imagePath = `User_Posts/${imageName}_image`;
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


    const generateEncryptionKey = (userId, minutes, hours, days, years,timestamp) => {
      let durationMilliseconds = 0;
      durationMilliseconds += minutes * 60 * 1000; // Convert minutes to milliseconds
      durationMilliseconds += hours * 60 * 60 * 1000; // Convert hours to milliseconds
      durationMilliseconds += days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
      durationMilliseconds += years * 365 * 24 * 60 * 60 * 1000; // Convert years to milliseconds
      const expirationTimestamp = durationMilliseconds;
      return expirationTimestamp;
    };
    

//   


const renderUserImage = (user) => {
  const currentTime = new Date().getTime();
  const expirationTimestamp = user.timestamp + generateEncryptionKey(user.userId, user.minutes, user.hours, user.days, user.years);

  const displayTime = expirationTimestamp-currentTime;
  // Convert milliseconds to minutes
    const disMinutes = Math.floor(displayTime / (1000 * 60));

    // Convert milliseconds to days
    const disDays = Math.floor(displayTime / (1000 * 60 * 60 * 24));

    const disHours = Math.floor(displayTime / (1000 * 60 * 60));

    // Convert milliseconds to years
    const disYears = Math.floor(disDays / 365);

    // Calculate remaining days after subtracting years
    const disRemainingDays = disDays % 365;

  if (currentTime < expirationTimestamp) {
    // Show the default image for the user
    return (
      <>
      <Image source={staticImage} style={{ width: 300, height: 300 }} />
      <Text style={styles.message}>Capsule locked for {`${disMinutes}`} minutes | {`${disDays}`} days | {`${disHours}`} | {`${disRemainingDays}`} Days | {`${disYears}`}  Years</Text>
      </>
    );
  } else {
    // Show the main image specified by the user
    const imageUrl = imageURL[`${user.userId}_${user.postName}`];

    if (imageUrl) {
      return (
        <>
          <Image source={{ uri: imageUrl }} style={{ width: 300, height: 300 }} />
          <Text style={styles.message}>Message From {`${user.username}`} |  {`${user.encMessage}`}</Text> 
        </>
      );
    } else {
      return <Text>No image found</Text>;
    }
  }
};
  
    return (
      <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Comiunity Capsules</Text>
        {/* Display images for each user */}
        {users.map(user => (
          <View key={user.userId}>
            <Text style ={styles.username}>{user.username}</Text>
            {imageURL[`${user.userId}_${user.postName}`] ? (
            renderUserImage(user, imageURL)) : (
              <Text>No image found</Text>)}
          </View>
        ))}
      </View>
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 90,
  },
  container: {
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
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom:15
  },
  header:{
    textAlign: 'center', 
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom:40
  },
  message:{
    marginTop: 15,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom:40
  }
});

export default EncryptImage;
