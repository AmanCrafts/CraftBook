import React from 'react'
import { View, StyleSheet } from 'react-native'

import Login from '../components/Login'
import Register from '../components/Register'

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Login navigation={navigation} />
      <Register />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default LoginScreen  