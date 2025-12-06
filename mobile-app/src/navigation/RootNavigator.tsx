import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

interface Props {
    isAuthenticated: boolean;
    onLoginSuccess: () => void;
    onProfileComplete: () => void;
}

export default function RootNavigator({
    isAuthenticated,
    onLoginSuccess,
    onProfileComplete
}: Props) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
                <Stack.Screen name="Auth">
                    {props => (
                        <AuthNavigator
                            onLoginSuccess={onLoginSuccess}
                            onProfileComplete={onProfileComplete}
                        />
                    )}
                </Stack.Screen>
            ) : (
                <Stack.Screen name="Main" component={MainTabNavigator} />
            )}
        </Stack.Navigator>
    );
}
