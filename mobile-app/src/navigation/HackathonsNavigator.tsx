import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HackathonsStackParamList } from '../types';
import HackathonListScreen from '../screens/hackathons/HackathonListScreen';
import HackathonDetailScreen from '../screens/hackathons/HackathonDetailScreen';

const Stack = createStackNavigator<HackathonsStackParamList>();

export default function HackathonsNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HackathonList"
                component={HackathonListScreen}
                options={{ title: 'Hackathons' }}
            />
            <Stack.Screen
                name="HackathonDetail"
                component={HackathonDetailScreen}
                options={{ title: 'Hackathon Details' }}
            />
        </Stack.Navigator>
    );
}
