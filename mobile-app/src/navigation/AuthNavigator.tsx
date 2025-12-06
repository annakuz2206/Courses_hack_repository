import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types';
import LoginScreen from '../screens/auth/LoginScreen';
import ProfileFormScreen from '../screens/onboarding/ProfileFormScreen';

const Stack = createStackNavigator<AuthStackParamList>();

interface Props {
    onLoginSuccess: () => void;
    onProfileComplete: () => void;
}

export default function AuthNavigator({ onLoginSuccess, onProfileComplete }: Props) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login">
                {props => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="ProfileForm">
                {props => <ProfileFormScreen {...props} onComplete={onProfileComplete} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
