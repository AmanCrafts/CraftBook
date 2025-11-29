import { StyleSheet, Text, View } from "react-native";
import COLORS from "../../constants/colors";

// Profile Stats Component
const ProfileStats = ({ posts = 0, followers = 0, following = 0 }) => {
  const StatItem = ({ label, value }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatItem label="Posts" value={posts} />
      <View style={styles.divider} />
      <StatItem label="Followers" value={followers} />
      <View style={styles.divider} />
      <StatItem label="Following" value={following} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 24,
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
});

export default ProfileStats;
