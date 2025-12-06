import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { SwipeCard } from '../../types';
import { swipe } from '../../services/api';

export default function SwipeScreen() {
    const [currentCard, setCurrentCard] = useState<SwipeCard | null>(null);
    const [cards, setCards] = useState<SwipeCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Mock data - in real app, fetch from API
        setCards([
            {
                id: 't1',
                type: 'team',
                name: 'AI Ninjas',
                description: 'Looking for Frontend and Designer',
                lookingForRoles: ['Frontend', 'Designer'],
            },
            {
                id: 't2',
                type: 'team',
                name: 'Frontend Wizards',
                description: 'Need Backend developer',
                lookingForRoles: ['Backend'],
            },
        ]);
    }, []);

    useEffect(() => {
        if (cards.length > 0 && currentIndex < cards.length) {
            setCurrentCard(cards[currentIndex]);
        } else {
            setCurrentCard(null);
        }
    }, [currentIndex, cards]);

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (!currentCard) return;

        try {
            const result = await swipe(
                'participant',
                'u1', // Current user ID - should come from context
                currentCard.type,
                currentCard.id,
                direction
            );

            if (result.match) {
                Alert.alert('Match!', 'You matched with ' + currentCard.name);
            }

            // Move to next card
            setCurrentIndex(prev => prev + 1);
        } catch (error) {
            console.error('Swipe failed', error);
            Alert.alert('Error', 'Failed to swipe');
        }
    };

    if (!currentCard) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>No more cards</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{currentCard.name}</Text>
                <Text style={styles.cardDescription}>{currentCard.description}</Text>

                {currentCard.lookingForRoles && (
                    <View style={styles.rolesContainer}>
                        <Text style={styles.rolesLabel}>Looking for:</Text>
                        <Text style={styles.rolesText}>
                            {currentCard.lookingForRoles.join(', ')}
                        </Text>
                    </View>
                )}

                {currentCard.skills && (
                    <View style={styles.skillsContainer}>
                        <Text style={styles.skillsLabel}>Skills:</Text>
                        <Text style={styles.skillsText}>
                            {currentCard.skills.join(', ')}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonsContainer}>
                <View style={styles.button}>
                    <Button title="Dislike" onPress={() => handleSwipe('left')} />
                </View>
                <View style={styles.button}>
                    <Button title="Like" onPress={() => handleSwipe('right')} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
        padding: 20,
        marginBottom: 30,
    },
    cardTitle: {
        fontSize: 24,
        marginBottom: 15,
    },
    cardDescription: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    rolesContainer: {
        marginTop: 10,
    },
    rolesLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    rolesText: {
        fontSize: 14,
    },
    skillsContainer: {
        marginTop: 10,
    },
    skillsLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    skillsText: {
        fontSize: 14,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
    },
});
