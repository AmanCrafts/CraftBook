import { StyleSheet, View } from "react-native";
import Login from "../../components/common/Login";
import Register from "../../components/common/Register";
import COLORS from "../../constants/colors";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Login navigation={navigation} />
      <Register />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default LoginScreen;
