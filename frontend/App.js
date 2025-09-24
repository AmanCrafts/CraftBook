import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import firebase from 'firebase/app'
import { initializeApp } from 'firebase/app';

import Register from './components/Register';
import Login from './components/Login';
import LoginScreen from './screens/LoginScreen';




export default function App() {

  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  return (
    <View style={styles.container}>
      <LoginScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
