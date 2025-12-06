import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleProfileComplete = () => {
    // Profile is complete, user can now access main app
    console.log('Profile completed');
  };

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator
        isAuthenticated={isAuthenticated}
        onLoginSuccess={handleLoginSuccess}
        onProfileComplete={handleProfileComplete}
      />
    </NavigationContainer>
  );
}
