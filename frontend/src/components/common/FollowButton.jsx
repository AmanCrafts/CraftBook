import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import followAPI from "../../api/follow.api";
import COLORS from "../../constants/colors";

const FollowButton = ({
  userId,
  currentUserId,
  initialIsFollowing = false,
  onFollowChange,
  size = "medium",
  showIcon = true,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  // Don't render if viewing own profile
  if (!userId || !currentUserId || userId === currentUserId) {
    return null;
  }

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleToggleFollow = async () => {
    if (loading) return;

    setLoading(true);
    const previousState = isFollowing;

    // Optimistic update
    setIsFollowing(!isFollowing);

    try {
      const result = await followAPI.toggleFollow(userId, currentUserId);
      setIsFollowing(result.isFollowing);
      onFollowChange?.(result.isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Revert on error
      setIsFollowing(previousState);
    } finally {
      setLoading(false);
    }
  };

  const buttonStyles = [
    styles.button,
    size === "small" && styles.buttonSmall,
    size === "large" && styles.buttonLarge,
    isFollowing ? styles.buttonFollowing : styles.buttonFollow,
  ];

  const textStyles = [
    styles.text,
    size === "small" && styles.textSmall,
    size === "large" && styles.textLarge,
    isFollowing ? styles.textFollowing : styles.textFollow,
  ];

  const iconSize = size === "small" ? 14 : size === "large" ? 20 : 16;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handleToggleFollow}
      activeOpacity={0.7}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isFollowing ? COLORS.primary : COLORS.white}
        />
      ) : (
        <>
          {showIcon && (
            <Ionicons
              name={isFollowing ? "checkmark" : "person-add-outline"}
              size={iconSize}
              color={isFollowing ? COLORS.primary : COLORS.white}
              style={styles.icon}
            />
          )}
          <Text style={textStyles}>{isFollowing ? "Following" : "Follow"}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
  },
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
  },
  buttonLarge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 120,
  },
  buttonFollow: {
    backgroundColor: COLORS.primary,
  },
  buttonFollowing: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 16,
  },
  textFollow: {
    color: COLORS.white,
  },
  textFollowing: {
    color: COLORS.primary,
  },
  icon: {
    marginRight: 4,
  },
});

export default FollowButton;
