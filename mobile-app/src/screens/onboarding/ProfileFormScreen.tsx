import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { updateProfile } from '../../services/api';

type ProfileFormNavigationProp = StackNavigationProp<AuthStackParamList, 'ProfileForm'>;

interface Props {
    navigation: ProfileFormNavigationProp;
    onComplete: () => void;
}

const ROLES = ['Frontend', 'Backend', 'Designer', 'Mobile', 'QA', 'Manager', 'ML Engineer'];

export default function ProfileFormScreen({ navigation, onComplete }: Props) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('Frontend');
    const [skills, setSkills] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim() || !role || !skills.trim()) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                name,
                role,
                skills: skills.split(',').map(s => s.trim()),
                bio,
            });
            onComplete();
        } catch (error) {
            Alert.alert('Error', 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Create Profile</Text>

            <Text style={styles.label}>Name *</Text>
            <TextInput
                style={styles.input}
                placeholder="Your name"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Role *</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={role}
                    onValueChange={setRole}
                >
                    {ROLES.map(r => (
                        <Picker.Item key={r} label={r} value={r} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Skills * (comma separated)</Text>
            <TextInput
                style={styles.input}
                placeholder="React, TypeScript, Node.js"
                value={skills}
                onChangeText={setSkills}
            />

            <Text style={styles.label}>About you</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about yourself"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
            />

            <Button
                title={loading ? 'Saving...' : 'Next'}
                onPress={handleSubmit}
                disabled={loading}
            />
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
    label: {
        fontSize: 14,
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
});
