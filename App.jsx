// App.js

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './fireBaseConfig';
import SignUpNav from './Navigators/SignUpNav';
import AppNav from './Navigators/AppNavigator';
import{createBottomTabNavigator} from '@react-navigation/bottom-tabs'

const Stack = createStackNavigator();
const InsideStack = createStackNavigator();


function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            console.log('user', user);
            setUser(user);
        });

        // Clean up subscription when component unmounts
        return unsubscribe;
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <Stack.Screen name="Inside" component={AppNav} options={{ headerShown: false }} />
                ) : (
                    <Stack.Screen name="LogIn" component={SignUpNav} options={{ headerShown: false }} /> 
                )}
            </Stack.Navigator>

        </NavigationContainer>
    );
}
const InsideTabs = () => {
    return (
        <>
            <AppNav /> {/* Render the bottom tab navigator */}
            <TopTabs /> {/* Render the top tab navigator */}
        </>
    );
};


export default App;
