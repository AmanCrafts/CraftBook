import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import userAPI from '../../api/user.api';

const CompleteProfileScreen = ({ route, navigation }) => {
    const { user: firebaseUser, setDbUser } = useAuth();
    // Get googleUser from route params (when coming from login) or from context (when app restarts)
    const googleUser = route.params?.googleUser || firebaseUser;

    const [name, setName] = useState(googleUser?.displayName || '');
    const [bio, setBio] = useState('');
    const [medium, setMedium] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        setLoading(true);

        try {
            if (!googleUser) {
                Alert.alert('Error', 'User information not found');
                return;
            }

            // Create user data
            const userData = {
                googleId: googleUser.uid,
                email: googleUser.email,
                name: name.trim(),
                bio: bio.trim(),
                medium: medium.trim(),
                profilePicture: googleUser.photoURL || null
            };

            // Send to backend using API helper
            const savedUser = await userAPI.createUser(userData);

            // Update the dbUser in AuthContext so navigation knows profile is complete
            setDbUser(savedUser);

            Alert.alert('Success', 'Profile saved successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.replace('MainApp')
                }
            ]);
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                />

                <Text style={styles.label}>Bio</Text>
                <TextInput
                    style={[styles.input, styles.bioInput]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell us about yourself (optional)"
                    multiline
                    numberOfLines={3}
                />

                <Text style={styles.label}>Favorite Art Medium</Text>
                <TextInput
                    style={styles.input}
                    value={medium}
                    onChangeText={setMedium}
                    placeholder="e.g., Digital Art, Oil Painting, Sketching (optional)"
                />

                <Button
                    title={loading ? "Saving..." : "Save Profile"}
                    onPress={handleSaveProfile}
                    disabled={loading}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    bioInput: {
        height: 80,
        textAlignVertical: 'top',
    },
});

export default CompleteProfileScreen;