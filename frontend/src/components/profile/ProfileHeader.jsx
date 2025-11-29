import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import COLORS from "../../constants/colors";

// Profile Header Component with Banner and Avatar
const ProfileHeader = ({
  bannerImage,
  profilePicture,
  onEditBanner,
  onEditAvatar,
  editable = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Banner Image */}
      <View style={styles.bannerContainer}>
        {bannerImage ? (
          <Image source={{ uri: bannerImage }} style={styles.banner} />
        ) : (
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          />
        )}

        {editable && (
          <TouchableOpacity
            style={styles.editBannerButton}
            onPress={onEditBanner}
            activeOpacity={0.7}
          >
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: profilePicture || "https://via.placeholder.com/120",
            }}
            style={styles.avatar}
          />
          {editable && (
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={onEditAvatar}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.editAvatarGradient}
              >
                <Ionicons name="camera" size={18} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  bannerContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  banner: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.gray200,
  },
  editBannerButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  editIconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -60,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: COLORS.gray200,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editAvatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
});

export default ProfileHeader;
