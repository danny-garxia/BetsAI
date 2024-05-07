import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native';
import { ref, get } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { FIREBASE_DB } from './fireBaseConfig';
import { FIREBASE_STG } from './fireBaseConfig';
import staticImage from './imgs/static.jpg';

const EncryptImage = () => {
  const [users, setUsers] = useState([]);
  const [imageURL, setImageURL] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [alertDisplayed, setAlertDisplayed] = useState(false); // New state for tracking alert display
  const db = FIREBASE_DB;
  const stg = FIREBASE_STG;

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [imageURL]);

  useEffect(() => {
    // Check if alert should be displayed
    users.forEach(user => {
      const threshold = 10000; // 10 seconds threshold

      const expirationTimestamp = user.timestamp + generateEncryptionKey(user.userId, user.minutes, user.hours, user.days, user.years);
      const notofTimestamp = (expirationTimestamp - generateNotifiKey(user.userId, user.notifMinutes, user.notifDays, user.notifYears));
      
      console.log("Current time:", currentTime);
      console.log("Notification timestamp:", notofTimestamp);
      console.log("Expiration timestamp:", expirationTimestamp);
  
      if (Math.abs(currentTime - notofTimestamp) <= threshold && !alertDisplayed) {
        console.log(`${user.username} Capsule will open in ${user.notifMinutes} minutes | ${user.notifDays} days | ${user.notifYears} Years`);
        alert(`${user.username} Capsule will open in ${user.notifMinutes} minutes | ${user.notifDays} days | ${user.notifYears} Years`);
        setAlertDisplayed(true);
      }

      if (Math.abs(currentTime - expirationTimestamp) <= threshold && !alertDisplayed) {
        console.log(`${user.username} Capsule is about to open`);
        alert(`${user.username} Capsule is about to open`);
        setAlertDisplayed(true);
      }
    });
  }, [users, currentTime, alertDisplayed]);

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
    const imageUrls = {};
    await Promise.all(usersList.map(async (user) => {
      const imageURL = await fetchUploadedImage(user.userId, user.postName);
      imageUrls[`${user.userId}_${user.postName}`] = imageURL;
    }));
    setImageURL(imageUrls);
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

      return jpgDownloadURL || pngDownloadURL;
    } catch (error) {
      console.error('Error fetching post image:', error);
      return null;
    }
  };

  const generateEncryptionKey = (userId, minutes, hours, days, years) => {
    let durationMilliseconds = 0;
    durationMilliseconds += minutes * 60 * 1000; // Convert minutes to milliseconds
    durationMilliseconds += hours * 60 * 60 * 1000; // Convert hours to milliseconds
    durationMilliseconds += days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    durationMilliseconds += years * 365 * 24 * 60 * 60 * 1000; // Convert years to milliseconds
    return durationMilliseconds;
  };

  const generateNotifiKey = (userId, notifMinutes, notifDays, notifYears) => {
    let notDurationMilliseconds = 0;
    notDurationMilliseconds += notifMinutes * 60 * 1000; // Convert minutes to milliseconds
    notDurationMilliseconds += notifDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    notDurationMilliseconds += notifYears * 365 * 24 * 60 * 60 * 1000; // Convert hours to milliseconds
    return notDurationMilliseconds;
  };

  const renderUserImage = (user) => {
    const displayTime = user.timestamp + generateEncryptionKey(user.userId, user.minutes, user.hours, user.days, user.years) - currentTime;
    const disMinutes = Math.floor(displayTime / (1000 * 60));
    const disDays = Math.floor(displayTime / (1000 * 60 * 60 * 24));
    const disHours = Math.floor(displayTime / (1000 * 60 * 60));
    const disYears = Math.floor(disDays / 365);
    const disRemainingDays = disDays % 365;

    if (currentTime < user.timestamp + generateEncryptionKey(user.userId, user.minutes, user.hours, user.days, user.years)) {
      return (
        <>
          <Image source={staticImage} style={{ width: 300, height: 300 }} />
          <Text style={styles.message}>Capsule locked for {`${disMinutes}`} minutes | {`${disDays}`} days | {`${disHours}`} | {`${disRemainingDays}`} Days | {`${disYears}`}  Years</Text>
        </>
      );
    } else {
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
        <Text style={styles.header}>Community Capsules</Text>
        {users.map(user => (
          <View key={user.userId}>
            <Text style={styles.username}>{user.username}</Text>
            {imageURL[`${user.userId}_${user.postName}`] ? (
              renderUserImage(user)) : (
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
  username: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  header: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40
  },
  message: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 40
  }
});

export default EncryptImage;
