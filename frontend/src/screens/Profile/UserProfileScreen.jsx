import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import followAPI from "../../api/follow.api";
import postAPI from "../../api/post.api";
import userAPI from "../../api/user.api";
import FollowButton from "../../components/common/FollowButton";
import ArtistInfo from "../../components/profile/ArtistInfo";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfilePostsGrid from "../../components/profile/ProfilePostsGrid";
import ProfileStats from "../../components/profile/ProfileStats";
import COLORS from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  });

  // Check if viewing own profile
  const isOwnProfile = currentUser?.id === userId;

  const loadUserProfile = useCallback(async () => {
    try {
      // If viewing own profile, redirect to Profile tab
      if (isOwnProfile) {
        navigation.replace("Profile");
        return;
      }

      // Fetch user data
      const userData = await userAPI.getUserById(userId);
      if (!userData) {
        Alert.alert("Error", "User not found");
        navigation.goBack();
        return;
      }
      setUser(userData);

      // Fetch user's posts
      const userPosts = await postAPI.getPostsByUserId(userId);
      setPosts(userPosts);

      // Fetch follow stats
      const followStats = await followAPI.getFollowStats(userId);

      // Check if current user is following this user
      if (currentUser?.id) {
        const following = await followAPI.checkFollowing(
          userId,
          currentUser.id
        );
        setIsFollowing(following);
      }

      setStats({
        posts: userPosts.length,
        followers: followStats.followers || 0,
        following: followStats.following || 0,
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
      Alert.alert("Error", "Failed to load profile");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [userId, isOwnProfile, navigation, currentUser?.id]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${user.name}'s profile on CraftBook! A talented artist specializing in ${user.medium || "various art forms"}.`,
      });
    } catch (error) {
      console.error("Error sharing profile:", error);
    }
  };

  const handleFollowChange = (newIsFollowing) => {
    setIsFollowing(newIsFollowing);
    // Update follower count
    setStats((prev) => ({
      ...prev,
      followers: newIsFollowing ? prev.followers + 1 : prev.followers - 1,
    }));
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    Alert.alert("Coming Soon", "Messaging feature will be available soon!");
  };

  // Parse art styles from medium if available
  const getArtStyles = () => {
    if (!user?.medium) return [];
    return user.medium
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="person-circle-outline"
          size={80}
          color={COLORS.gray400}
        />
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.gray700} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          bannerImage={user.bannerImage}
          profilePicture={user.profilePicture}
          editable={false}
        />

        <ProfileInfo
          name={user.name}
          bio={user.bio}
          medium={user.medium}
          email={null} // Don't show email for other users
        />

        <ProfileStats
          posts={stats.posts}
          followers={stats.followers}
          following={stats.following}
        />

        {/* Action Buttons for Other Users */}
        <View style={styles.actionsContainer}>
          <FollowButton
            userId={userId}
            currentUserId={currentUser?.id}
            initialIsFollowing={isFollowing}
            onFollowChange={handleFollowChange}
            size="large"
            showIcon={true}
          />

          <TouchableOpacity
            style={styles.messageButton}
            onPress={handleMessage}
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={COLORS.gray600} />
          </TouchableOpacity>
        </View>

        {/* Artist Info Section */}
        {user.medium && (
          <ArtistInfo
            medium={user.medium?.split(",")[0]?.trim()}
            artStyles={getArtStyles()}
            experience={user.experience}
            portfolio={user.portfolio}
          />
        )}

        {/* User's Posts */}
        <View style={styles.postsSection}>
          <View style={styles.postsSectionHeader}>
            <Ionicons name="grid-outline" size={20} color={COLORS.text} />
            <Text style={styles.postsSectionTitle}>
              {user.name?.split(" ")[0]}'s Artwork
            </Text>
          </View>
        </View>

        <ProfilePostsGrid
          posts={posts}
          onPostPress={(post) =>
            navigation.navigate("PostDetail", { postId: post.id })
          }
        />

        {/* Spacer at bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.gray600,
    fontWeight: "600",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    alignItems: "center",
  },
  followButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  followButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  messageButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  postsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  postsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  postsSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
});

export default UserProfileScreen;
