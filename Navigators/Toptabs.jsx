// NotificationsStack.js

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; // Import for top tabs
import Notifications from '../screens/Notifications';

const TopTab = createMaterialTopTabNavigator(); // Creating top tab navigator

const NotificationsStack = () => {
    return (
        <TopTab.Navigator>
            <TopTab.Screen
                name="Notifications"
                component={Notifications}
                options={{ tabBarLabel: 'Notifications' }} // Set options for the screen here
            />
            {/* Add other top tab screens here if needed */}
        </TopTab.Navigator>
    );
};

export default NotificationsStack;
