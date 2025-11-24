import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Register = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        New to CraftBook? Use the "Sign Up" option above to create your account!
      </Text>
      <Text style={styles.subtext}>
        Join thousands of artists sharing their craft and creativity.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default Register;
