import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import Material Community Icons
import Notifcations from '../screens/Notifications';
import { ImageManipulator } from 'expo-image-manipulator';


const Tab = createMaterialTopTabNavigator();

const HeaderNav = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#cbae73',
                inactiveTintColor: 'gray',
                labelStyle: { display: 'none' }, // Hide the tab bar label

            }}
        >
            <Tab.Screen
                name="Notifications"
                component={Notifcations}
                options={{
                    tabBarLabel: 'Notifications',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={20}  /> // Position icon to top right corner
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default HeaderNav;
