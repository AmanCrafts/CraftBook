import React from 'react'
import { useState } from 'react'
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert, TextInput } from 'react-native'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            let userCredential;
            if (isSignUp) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }

            const user = userCredential.user;
            console.log('Authentication successful:', user);

            if (isSignUp) {
                // New user, navigate to profile completion
                navigation.navigate('CompleteProfile', {
                    googleUser: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || '',
                        photoURL: user.photoURL
                    }
                });
            } else {
                // Existing user login, check if profile exists
                try {
                    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/google/${user.uid}`);
                    if (response.ok) {
                        Alert.alert('Welcome back!', `Hello ${user.email}`);
                        // Navigate to main app (we'll add this later)
                    } else {
                        // User logged in but no profile, send to complete profile
                        navigation.navigate('CompleteProfile', {
                            googleUser: {
                                uid: user.uid,
                                email: user.email,
                                displayName: user.displayName || '',
                                photoURL: user.photoURL
                            }
                        });
                    }
                } catch (error) {
                    console.log('User profile not found, going to profile completion');
                    navigation.navigate('CompleteProfile', {
                        googleUser: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || '',
                            photoURL: user.photoURL
                        }
                    });
                }
            }

        } catch (error) {
            console.error('Authentication error:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to CraftBook</Text>
            <Text style={styles.subtitle}>Where craft meets community</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Button
                            title={isSignUp ? "Sign Up" : "Sign In"}
                            onPress={handleAuth}
                        />
                        <Text style={styles.switchText}>
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                            <Text
                                style={styles.switchLink}
                                onPress={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </Text>
                        </Text>
                    </>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        maxWidth: 300,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    switchText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: '#666',
    },
    switchLink: {
        color: '#0066cc',
        fontWeight: '500',
    },
});

export default Login