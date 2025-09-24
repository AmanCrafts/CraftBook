import React from 'react'
import { useState } from 'react'
import { View, Text, Button, TextInput, ActivityIndicator } from 'react-native'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const Login = () => {
    // State variables
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState(null)

    // Firebase authentication
    const auth = getAuth();

    // Handle form submission
    const handleLogin = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;
            setUser(user);
            setSuccess(true);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <Text>Login</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {error ? <Text>{error}</Text> : null}
            {loading ? <ActivityIndicator /> : <Button title="Login" onPress={handleLogin} />}
        </View>
    )
}

export default Login