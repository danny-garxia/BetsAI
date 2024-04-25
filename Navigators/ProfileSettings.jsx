// PSettingsNav.js

import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProfileSet from '../screens/ProfileSett';
const Tab = createMaterialTopTabNavigator();

const PSettingsNav = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#cbae73',
                inactiveTintColor: 'gray',
                labelStyle: { display: 'none' }, // Hide the tab bar label
            }}
        >
            <Tab.Screen
                name="ProfileSettings"
                component={ProfileSet}
                options={{
                    tabBarLabel: 'Profile Settings',
                }}
            />
            
        </Tab.Navigator>
    );
};

export default PSettingsNav;
