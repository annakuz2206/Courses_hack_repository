import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { User } from '../../types';
import { getMe } from '../../services/api';

export default function MyProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getMe();
            setUser(data);
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        Alert.alert('Edit Profile', 'Navigate to edit profile screen');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        Alert.alert('Success', 'Logged out');
                        // Clear auth token and navigate to login
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Failed to load profile</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{user.name}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.value}>{user.role}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Skills:</Text>
                <Text style={styles.value}>{user.skills.join(', ')}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>About:</Text>
                <Text style={styles.value}>{user.bio}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Hackathons Experience:</Text>
                <Text style={styles.value}>{user.experienceHackathons}</Text>
            </View>

            {user.teamId && (
                <View style={styles.section}>
                    <Text style={styles.label}>Current Team:</Text>
                    <Text style={styles.value}>{user.teamId}</Text>
                </View>
            )}

            <View style={styles.actionsContainer}>
                <View style={styles.actionButton}>
                    <Button title="Edit Profile" onPress={handleEdit} />
                </View>
                <View style={styles.actionButton}>
                    <Button title="Logout" onPress={handleLogout} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
    },
    actionsContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    actionButton: {
        marginBottom: 10,
    },
});
