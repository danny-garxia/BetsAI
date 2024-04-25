import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import HeaderNav from '../Navigators/headerNav';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <HeaderNav />
        <View>
          <Text> Hello</Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
