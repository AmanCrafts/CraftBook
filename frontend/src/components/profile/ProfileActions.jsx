import { StyleSheet, View } from "react-native";
import COLORS from "../../constants/colors";
import Button from "../common/Button";

// Profile Actions Component
const ProfileActions = ({
  onEdit,
  onShare,
  onSettings,
  isOwnProfile = true,
}) => {
  if (!isOwnProfile) {
    return (
      <View style={styles.container}>
        <Button
          title="Follow"
          variant="primary"
          icon="person-add-outline"
          style={styles.followButton}
        />
        <Button
          title="Message"
          variant="outline"
          icon="chatbubble-outline"
          style={styles.messageButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Edit Profile"
        variant="primary"
        icon="create-outline"
        onPress={onEdit}
        style={styles.editButton}
        fullWidth
      />

      <View style={styles.secondaryActions}>
        <Button
          title="Share"
          variant="outline"
          size="small"
          icon="share-social-outline"
          onPress={onShare}
          style={styles.secondaryButton}
        />
        <Button
          title="Settings"
          variant="ghost"
          size="small"
          icon="settings-outline"
          onPress={onSettings}
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  editButton: {
    marginBottom: 12,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
  },
  followButton: {
    flex: 1,
    marginRight: 8,
  },
  messageButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default ProfileActions;
