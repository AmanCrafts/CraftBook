import React from 'react'
import { useState, useEffet } from 'react'
import { View, Text, Button, TextInput, ActivityIndicator } from 'react-native'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


const Register = () => {
    // State variables
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [user, setUser] = useState(null)

    // Firebase authentication
    const auth = getAuth();

    // Handle form submission
    const handleRegister = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
            <Text>Register</Text>
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            {error ? <Text>{error}</Text> : null}
            {loading ? <ActivityIndicator /> : <Button title="Register" onPress={handleRegister} />}
        </View>
    )
}

export default Register