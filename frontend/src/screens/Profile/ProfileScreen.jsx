import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
import postAPI from "../../api/post.api";
import uploadAPI from "../../api/upload.api";
import userAPI from "../../api/user.api";
import EditProfileModal from "../../components/profile/EditProfileModal";
import ProfileActions from "../../components/profile/ProfileActions";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfilePostsGrid from "../../components/profile/ProfilePostsGrid";
import ProfileStats from "../../components/profile/ProfileStats";
import COLORS from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  });

  const loadUserProfile = useCallback(async () => {
    try {
      if (!authUser) {
        navigation.replace("Login");
        return;
      }

      setUser(authUser);

      const userPosts = await postAPI.getPostsByUserId(authUser.id);
      setPosts(userPosts);

      setStats({
        posts: userPosts.length,
        followers: 0,
        following: 0,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [authUser, navigation]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const pickAvatar = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingImage(true);
        try {
          const uploadResult = await uploadAPI.uploadImage(
            result.assets[0].uri
          );
          await userAPI.updateUser(user.id, {
            profilePicture: uploadResult.image.url,
          });
          setUser((prev) => ({
            ...prev,
            profilePicture: uploadResult.image.url,
          }));
          Alert.alert("Success", "Profile picture updated");
        } catch (error) {
          console.error("Error uploading avatar:", error);
          Alert.alert("Error", "Failed to update profile picture");
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error("Error picking avatar:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickBannerImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingImage(true);
        try {
          const uploadResult = await uploadAPI.uploadImage(
            result.assets[0].uri
          );
          await userAPI.updateUser(user.id, {
            bannerImage: uploadResult.image.url,
          });
          setUser((prev) => ({ ...prev, bannerImage: uploadResult.image.url }));
          Alert.alert("Success", "Banner image updated");
        } catch (error) {
          console.error("Error uploading banner:", error);
          Alert.alert("Error", "Failed to update banner image");
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error("Error picking banner:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      await userAPI.updateUser(user.id, data);
      setUser((prev) => ({ ...prev, ...data }));
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
      throw error;
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out " + user.name + "'s profile on CraftBook!",
      });
    } catch (error) {
      console.error("Error sharing profile:", error);
    }
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings feature coming soon!");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            navigation.replace("Login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
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
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          bannerImage={user.bannerImage}
          profilePicture={user.profilePicture}
          onEditBanner={pickBannerImage}
          onEditAvatar={pickAvatar}
          editable
        />

        <ProfileInfo
          name={user.name}
          bio={user.bio}
          medium={user.medium}
          email={user.email}
        />

        <ProfileStats
          posts={stats.posts}
          followers={stats.followers}
          following={stats.following}
        />

        <ProfileActions
          onEdit={() => setEditModalVisible(true)}
          onShare={handleShare}
          onSettings={handleSettings}
          isOwnProfile
        />

        <ProfilePostsGrid
          posts={posts}
          onPostPress={(post) =>
            navigation.navigate("PostDetail", { postId: post.id })
          }
          onUploadPress={() => navigation.navigate("Upload")}
        />
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>

      <EditProfileModal
        visible={editModalVisible}
        user={user}
        onClose={() => setEditModalVisible(false)}
        onSave={handleUpdateProfile}
      />

      {uploadingImage && (
        <View style={styles.uploadingOverlay}>
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.uploadingText}>Uploading image...</Text>
          </View>
        </View>
      )}
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
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 20,
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
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingContainer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  uploadingText: {
    fontSize: 16,
    color: COLORS.gray700,
    fontWeight: "600",
  },
});

export default ProfileScreen;
