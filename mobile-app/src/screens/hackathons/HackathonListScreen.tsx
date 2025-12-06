import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HackathonsStackParamList, Hackathon } from '../../types';
import { getHackathons } from '../../services/api';

type HackathonListNavigationProp = StackNavigationProp<HackathonsStackParamList, 'HackathonList'>;

interface Props {
    navigation: HackathonListNavigationProp;
}

export default function HackathonListScreen({ navigation }: Props) {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHackathons();
    }, []);

    const loadHackathons = async () => {
        try {
            const data = await getHackathons();
            setHackathons(data);
        } catch (error) {
            console.error('Failed to load hackathons', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Hackathon }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('HackathonDetail', { hackathonId: item.id })}
        >
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDate}>
                {new Date(item.startDate).toLocaleDateString()}
            </Text>
            <Text style={styles.itemTeamSize}>Max team: {item.maxTeamSize}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={hackathons}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 10,
    },
    item: {
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    itemTitle: {
        fontSize: 18,
        marginBottom: 5,
    },
    itemDate: {
        fontSize: 14,
        marginBottom: 3,
    },
    itemTeamSize: {
        fontSize: 12,
    },
});
