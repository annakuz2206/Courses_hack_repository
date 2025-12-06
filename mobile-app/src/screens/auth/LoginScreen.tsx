import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { devLogin, setAuthToken } from '../../services/api';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
    navigation: LoginScreenNavigationProp;
    onLoginSuccess: () => void;
}

export default function LoginScreen({ navigation, onLoginSuccess }: Props) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!code.trim()) {
            Alert.alert('Error', 'Please enter participant ID');
            return;
        }

        setLoading(true);
        try {
            const token = await devLogin(code);
            setAuthToken(token);
            onLoginSuccess();
        } catch (error) {
            Alert.alert('Error', 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Enter your participant ID</Text>

            <TextInput
                style={styles.input}
                placeholder="Participant ID (e.g., u1)"
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
            />

            <Button
                title={loading ? 'Loading...' : 'Enter'}
                onPress={handleLogin}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
    },
});
