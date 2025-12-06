import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { Team, User } from '../../types';

export default function TeamScreen() {
    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [isCaptain, setIsCaptain] = useState(false);

    useEffect(() => {
        // Mock data - in real app, fetch from API
        setTeam({
            id: 't1',
            name: 'AI Ninjas',
            hackathonId: 'h1',
            captainId: 'u1',
            memberIds: ['u1', 'u2'],
            lookingForRoles: ['Frontend', 'Designer'],
            description: 'Building AI solution',
        });

        setMembers([
            {
                id: 'u1',
                name: 'John',
                role: 'Backend',
                skills: ['Node.js', 'Python'],
                bio: 'Backend developer',
                experienceHackathons: 3,
            },
            {
                id: 'u2',
                name: 'Jane',
                role: 'ML Engineer',
                skills: ['Python', 'TensorFlow'],
                bio: 'ML specialist',
                experienceHackathons: 2,
            },
        ]);

        setIsCaptain(true); // Mock - should check if current user is captain
    }, []);

    const handleRemoveMember = (memberId: string) => {
        Alert.alert(
            'Remove Member',
            'Are you sure you want to remove this member?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    onPress: () => {
                        Alert.alert('Success', 'Member removed');
                        // API call to remove member
                    },
                },
            ]
        );
    };

    const handleEditTeam = () => {
        Alert.alert('Edit Team', 'Navigate to edit team screen');
    };

    const handleLeaveTeam = () => {
        Alert.alert(
            'Leave Team',
            'Are you sure you want to leave this team?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Leave',
                    onPress: () => {
                        Alert.alert('Success', 'You left the team');
                        // API call to leave team
                    },
                },
            ]
        );
    };

    const renderMember = ({ item }: { item: User }) => (
        <View style={styles.memberItem}>
            <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberRole}>{item.role}</Text>
                <Text style={styles.memberSkills}>{item.skills.join(', ')}</Text>
            </View>

            {isCaptain && item.id !== team?.captainId && (
                <Button
                    title="Remove"
                    onPress={() => handleRemoveMember(item.id)}
                />
            )}
        </View>
    );

    if (!team) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>You are not in a team</Text>
                <Button title="Find Team" onPress={() => Alert.alert('Navigate to matching')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{team.name}</Text>
            <Text style={styles.description}>{team.description}</Text>

            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Looking for:</Text>
                <Text style={styles.infoText}>{team.lookingForRoles.join(', ')}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Members ({members.length}/{5}):</Text>
            </View>

            <FlatList
                data={members}
                renderItem={renderMember}
                keyExtractor={item => item.id}
                style={styles.membersList}
            />

            <View style={styles.actionsContainer}>
                {isCaptain && (
                    <View style={styles.actionButton}>
                        <Button title="Edit Team" onPress={handleEditTeam} />
                    </View>
                )}
                <View style={styles.actionButton}>
                    <Button title="Leave Team" onPress={handleLeaveTeam} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
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
    infoText: {
        fontSize: 16,
    },
    membersList: {
        flex: 1,
        marginBottom: 20,
    },
    memberItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        marginBottom: 5,
    },
    memberRole: {
        fontSize: 14,
        marginBottom: 3,
    },
    memberSkills: {
        fontSize: 12,
    },
    actionsContainer: {
        marginTop: 10,
    },
    actionButton: {
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
});
