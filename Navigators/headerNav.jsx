import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import Material Community Icons
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
        
        </Tab.Navigator>
    );
};

export default HeaderNav;
