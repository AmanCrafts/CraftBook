import { StyleSheet, Text, View } from "react-native";
import COLORS from "../../constants/colors";

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
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default Register;
