import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { likeAPI } from "../../api/like.api";
import PostCard from "../../components/common/PostCard";
import COLORS from "../../constants/colors";
import ROUTES from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("recent");
  const [likedPosts, setLikedPosts] = useState({});
  const currentUserId = user?.id;

  const fetchPosts = useCallback(async () => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;

      // Fetch posts based on filter
      let endpoint = "/api/posts/recent";
      if (filter === "popular") {
        endpoint = "/api/posts/popular";
      }

      const response = await fetch(`${API_URL}${endpoint}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data);

        // Fetch like status for all posts
        if (currentUserId) {
          const likeStatuses = {};
          await Promise.all(
            data.map(async (post) => {
              try {
                const liked = await likeAPI.checkUserLike(
                  post.id,
                  currentUserId
                );
                likeStatuses[post.id] = liked;
              } catch (error) {
                console.error(
                  `Error checking like for post ${post.id}:`,
                  error
                );
                likeStatuses[post.id] = false;
              }
            })
          );
          setLikedPosts(likeStatuses);
        }
      } else {
        console.error("Error fetching posts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, currentUserId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleCommentPress = (post) => {
    navigation.navigate("PostDetail", { postId: post.id });
  };

  const handleProfilePress = (userId) => {
    if (userId) {
      navigation.navigate(ROUTES.USER_PROFILE, { userId });
    }
  };

  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case "recent":
        return "time-outline";
      case "popular":
        return "flame-outline";
      case "following":
        return "people-outline";
      default:
        return "grid-outline";
    }
  };

  const renderFilterButton = (filterType, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(filterType)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={getFilterIcon(filterType)}
        size={18}
        color={filter === filterType ? COLORS.white : COLORS.textSecondary}
        style={styles.filterIcon}
      />
      <Text
        style={[
          styles.filterButtonText,
          filter === filterType && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="brush" size={28} color={COLORS.white} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>CraftBook</Text>
              <Text style={styles.headerSubtitle}>Discover Amazing Art</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.filterContainer}>
        {renderFilterButton("recent", "Recent")}
        {renderFilterButton("popular", "Popular")}
        {renderFilterButton("following", "Following")}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => handleCommentPress(item)}
            onCommentPress={() => handleCommentPress(item)}
            onProfilePress={handleProfilePress}
            userId={currentUserId}
            initialLiked={likedPosts[item.id] || false}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>
              Be the first to share your artwork!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundSecondary,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    gap: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundSecondary,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HomeScreen;
