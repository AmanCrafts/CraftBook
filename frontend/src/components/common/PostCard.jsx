import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import LikeButton from "./LikeButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MAX_IMAGE_HEIGHT = 500;
const MIN_IMAGE_HEIGHT = 200;

const PostCard = ({
  post,
  onPress,
  onCommentPress,
  onProfilePress,
  userId,
  initialLiked,
}) => {
  const [imageHeight, setImageHeight] = useState(300);

  useEffect(() => {
    if (post.imageUrl) {
      Image.getSize(
        post.imageUrl,
        (width, height) => {
          const aspectRatio = height / width;
          const calculatedHeight = SCREEN_WIDTH * aspectRatio;

          // Clamp height between min and max
          const finalHeight = Math.min(
            Math.max(calculatedHeight, MIN_IMAGE_HEIGHT),
            MAX_IMAGE_HEIGHT
          );

          setImageHeight(finalHeight);
        },
        (error) => {
          console.error("Error getting image size:", error);
          setImageHeight(300);
        }
      );
    }
  }, [post.imageUrl]);
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image
          source={{ uri: post.imageUrl || "https://via.placeholder.com/400" }}
          style={[styles.image, { height: imageHeight }]}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.artistInfo}
            onPress={() => onProfilePress?.(post.author?.id)}
            activeOpacity={0.7}
          >
            <Image
              source={{
                uri:
                  post.author?.profilePicture ||
                  "https://via.placeholder.com/40",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.artistName}>
                {post.author?.name || "Artist"}
              </Text>
              <Text style={styles.medium}>{post.medium || "Mixed Media"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{post.title}</Text>
        {post.description && (
          <Text style={styles.description} numberOfLines={2}>
            {post.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.actions}>
            <LikeButton
              postId={post.id}
              initialLiked={initialLiked}
              initialCount={post._count?.likes || 0}
              userId={userId}
            />
            <TouchableOpacity
              style={styles.actionItem}
              onPress={(e) => {
                e.stopPropagation();
                onCommentPress?.();
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.actionText}>
                {post._count?.comments || 0}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeAgo}>
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    backgroundColor: COLORS.gray200,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  artistInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: COLORS.gray200,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  medium: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  actions: {
    flexDirection: "row",
    gap: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
});

export default PostCard;
