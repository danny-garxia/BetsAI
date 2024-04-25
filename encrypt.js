import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import CryptoJS from 'crypto-js';
import { storageRef, downloadBytes } from 'firebase/storage'; // import storageRef and downloadBytes from firebase storage

const EncryptImage = () => {
  const [encryptedData, setEncryptedData] = useState(null);


  
  const fetchEncryptedImageFromStorage = async (imagePath) => {
    try {
      // Fetch image data from Firebase Storage
      const imageRef = storageRef(imagePath); // Use the provided imagePath directly
      const encryptedImage = await downloadBytes(imageRef);

      // Decrypt the image data using CryptoJS
      const decryptedData = CryptoJS.AES.decrypt(encryptedImage, 'secretKey').toString(CryptoJS.enc.Utf8);

      // Return the decrypted image data
      return decryptedData;
    } catch (error) {
      console.error('Error fetching image from storage:', error);
      return null;
    }
  };

  const handleImageSelect = async () => {
    try {
      // Fetch encrypted image data from Firebase Storage
      const imagePath = 'User_Posts/' + 'your_image_name_here'; // Update with actual image path
      const data = await fetchEncryptedImageFromStorage(imagePath);
      setEncryptedData(data); // Update state with encrypted data
    } catch (error) {
      console.error('Error fetching and decrypting image:', error);
    }
  };

  return (
    <View>
      {/* Button to fetch and decrypt image */}
      <Button title="Fetch and Decrypt Image" onPress={handleImageSelect} />
      {/* Display the encrypted data */}
      {encryptedData && (
        <View>
          <Text>Encrypted Image Data:</Text>
          <Text>{encryptedData}</Text>
        </View>
      )}
    </View>
  );
};

export default EncryptImage;
