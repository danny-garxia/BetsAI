// ParentComponent.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from '../screens/LogIn';
import SignUp from '../screens/SignUp';
const Stack = createStackNavigator();

const SignUpNav = () => {
    return (
            <Stack.Navigator>
                <Stack.Screen name="LogIn" component={LogIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
            </Stack.Navigator>
    );
};

export default SignUpNav;
