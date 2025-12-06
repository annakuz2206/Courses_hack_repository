import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';
import HackathonsNavigator from './HackathonsNavigator';
import SwipeScreen from '../screens/matching/SwipeScreen';
import TeamScreen from '../screens/team/TeamScreen';
import MyProfileScreen from '../screens/team/MyProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Hackathons"
                component={HackathonsNavigator}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Matching"
                component={SwipeScreen}
                options={{ title: 'Swipe' }}
            />
            <Tab.Screen
                name="Team"
                component={TeamScreen}
                options={{ title: 'My Team' }}
            />
            <Tab.Screen
                name="Profile"
                component={MyProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
}
