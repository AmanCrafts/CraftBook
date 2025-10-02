import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';

const CompleteProfileScreen = ({ route, navigation }) => {
    const { googleUser } = route.params;

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
            // Create user data
            const userData = {
                googleId: googleUser.uid,
                email: googleUser.email,
                name: name.trim(),
                bio: bio.trim(),
                medium: medium.trim(),
                profilePicture: googleUser.photoURL || null
            };

            // Send to backend
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const savedUser = await response.json();
                Alert.alert('Success', 'Profile saved successfully!');
                // Navigate to main app (we'll add this later)
                console.log('User saved:', savedUser);
            } else {
                const error = await response.json();
                Alert.alert('Error', error.error || 'Failed to save profile');
            }
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