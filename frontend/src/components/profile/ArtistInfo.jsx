import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../../constants/colors";

// Artist Info Component - shows artist-specific information
const ArtistInfo = ({ medium, artStyles, experience, portfolio }) => {
  const renderInfoItem = (icon, label, value) => {
    if (!value) return null;
    return (
      <View style={styles.infoItem}>
        <View style={styles.infoIconContainer}>
          <Ionicons name={icon} size={18} color={COLORS.primary} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    );
  };

  const renderTagItem = (tag) => (
    <View key={tag} style={styles.tag}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="color-palette" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Artist Profile</Text>
      </View>

      <View style={styles.infoGrid}>
        {renderInfoItem("brush-outline", "Primary Medium", medium)}
        {renderInfoItem("star-outline", "Experience", experience)}
        {renderInfoItem("globe-outline", "Portfolio", portfolio)}
      </View>

      {artStyles && artStyles.length > 0 && (
        <View style={styles.tagsSection}>
          <Text style={styles.tagsLabel}>Art Styles</Text>
          <View style={styles.tagsContainer}>
            {artStyles.map(renderTagItem)}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${COLORS.primaryLighter}30`,
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  tagsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tagsLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: `${COLORS.primaryLighter}30`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
});

export default ArtistInfo;
