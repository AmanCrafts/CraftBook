import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import userAPI from '../../api/user.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import COLORS from '../../constants/colors';

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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryDark]}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="person-add-outline" size={36} color={COLORS.white} />
                        </LinearGradient>
                    </View>
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.subtitle}>Tell us a bit about yourself and your art</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        icon="person-outline"
                    />

                    <Input
                        label="Bio (Optional)"
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself and your artistic journey"
                        multiline
                        numberOfLines={4}
                        icon="create-outline"
                    />

                    <Input
                        label="Favorite Art Medium (Optional)"
                        value={medium}
                        onChangeText={setMedium}
                        placeholder="e.g., Digital Art, Oil Painting, Sketching"
                        icon="color-palette-outline"
                    />

                    <Button
                        title="Complete Profile"
                        onPress={handleSaveProfile}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        icon="checkmark-circle-outline"
                        style={styles.saveButton}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconGradient: {
        width: 72,
        height: 72,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 22,
    },
    form: {
        flex: 1,
    },
    saveButton: {
        marginTop: 16,
        marginBottom: 32,
    },
});

export default CompleteProfileScreen;