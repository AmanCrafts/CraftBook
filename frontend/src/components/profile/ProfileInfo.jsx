import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../../constants/colors";

// Profile Info Component with name, bio, and medium
const ProfileInfo = ({ name, bio, medium, email }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>

      {medium && (
        <View style={styles.mediumContainer}>
          <Ionicons name="color-palette" size={16} color={COLORS.primary} />
          <Text style={styles.medium}>{medium}</Text>
        </View>
      )}

      {email && (
        <View style={styles.emailContainer}>
          <Ionicons name="mail" size={14} color={COLORS.textSecondary} />
          <Text style={styles.email}>{email}</Text>
        </View>
      )}

      {bio && <Text style={styles.bio}>{bio}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  mediumContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  medium: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  email: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  bio: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});

export default ProfileInfo;
