import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HackathonsStackParamList, Hackathon } from '../../types';
import { getHackathonById } from '../../services/api';

type HackathonDetailNavigationProp = StackNavigationProp<HackathonsStackParamList, 'HackathonDetail'>;
type HackathonDetailRouteProp = RouteProp<HackathonsStackParamList, 'HackathonDetail'>;

interface Props {
    navigation: HackathonDetailNavigationProp;
    route: HackathonDetailRouteProp;
}

export default function HackathonDetailScreen({ navigation, route }: Props) {
    const { hackathonId } = route.params;
    const [hackathon, setHackathon] = useState<Hackathon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHackathon();
    }, []);

    const loadHackathon = async () => {
        try {
            const data = await getHackathonById(hackathonId);
            setHackathon(data);
        } catch (error) {
            console.error('Failed to load hackathon', error);
        } finally {
            setLoading(false);
        }
    };

    const handleParticipate = () => {
        Alert.alert(
            'Choose Strategy',
            'How do you want to participate?',
            [
                {
                    text: 'Join Team',
                    onPress: () => {
                        Alert.alert('Success', 'You will see teams to swipe');
                        // Navigate to matching screen
                    },
                },
                {
                    text: 'Create Team',
                    onPress: () => {
                        Alert.alert('Success', 'Navigate to team creation');
                        // Navigate to team creation
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
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

    if (!hackathon) {
        return (
            <View style={styles.container}>
                <Text>Hackathon not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{hackathon.name}</Text>
            <Text style={styles.description}>{hackathon.description}</Text>

            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Start Date:</Text>
                <Text style={styles.infoValue}>
                    {new Date(hackathon.startDate).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>End Date:</Text>
                <Text style={styles.infoValue}>
                    {new Date(hackathon.endDate).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Max Team Size:</Text>
                <Text style={styles.infoValue}>{hackathon.maxTeamSize}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Participate" onPress={handleParticipate} />
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
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    infoSection: {
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
});
