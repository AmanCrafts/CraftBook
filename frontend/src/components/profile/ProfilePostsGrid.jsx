import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";

// Profile Posts Grid Component
const ProfilePostsGrid = ({ posts, onPostPress, onUploadPress }) => {
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => onPostPress?.(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.postImage}
        resizeMode="cover"
      />
      {item.isProcessPost && (
        <View style={styles.processbadge}>
          <Ionicons name="layers" size={16} color={COLORS.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons
            name="images-outline"
            size={64}
            color={COLORS.textTertiary}
          />
        </View>
        <Text style={styles.emptyTitle}>No artwork yet</Text>
        <Text style={styles.emptySubtitle}>
          Share your creative work with the community
        </Text>
        {onUploadPress && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={onUploadPress}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={styles.uploadButtonText}>Upload Artwork</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Artwork</Text>
        <Text style={styles.count}>{posts.length} posts</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginTop: 8,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  count: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  grid: {
    paddingHorizontal: 20,
  },
  row: {
    marginBottom: 4,
  },
  postItem: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.gray200,
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  processBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 4,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
});

export default ProfilePostsGrid;
