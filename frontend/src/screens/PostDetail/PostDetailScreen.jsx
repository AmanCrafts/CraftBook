import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import likeAPI from "../../api/like.api";
import postAPI from "../../api/post.api";
import CommentSection from "../../components/common/CommentSection";
import LikeButton from "../../components/common/LikeButton";
import COLORS from "../../constants/colors";
import ROUTES from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const { user: currentUser } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const [post, setPost] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageAspectRatio, setImageAspectRatio] = useState(4 / 5);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      if (currentUser) {
        // Get post
        const postData = await postAPI.getPostById(postId);
        setPost(postData);

        // Check if user has liked the post
        const likeStatus = await likeAPI.checkUserLike(postId, currentUser.id);
        setHasLiked(likeStatus);
      }
    } catch (error) {
      console.error("Error loading post:", error);
      Alert.alert("Error", "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [postId, currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Measure main image aspect ratio
  useEffect(() => {
    if (post?.imageUrl) {
      Image.getSize(
        post.imageUrl,
        (w, h) => {
          if (w > 0 && h > 0) {
            const ratio = Math.min(2, Math.max(0.5, w / h));
            setImageAspectRatio(ratio);
          }
        },
        () => { },
      );
    }
  }, [post?.imageUrl]);

  const handleShare = () => {
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const handleProfilePress = () => {
    if (post?.author?.id) {
      navigation.navigate(ROUTES.USER_PROFILE, { userId: post.author.id });
    }
  };

  // Build carousel data: main image + up to 7 process stages
  const buildCarousel = () => {
    if (!post) return [];
    const slides = [{ imageUrl: post.imageUrl, stageLabel: null }];
    if (
      post.isProcessPost &&
      post.processStages &&
      Array.isArray(post.processStages)
    ) {
      const stages = post.processStages.slice(0, 7);
      for (const stage of stages) {
        if (stage.imageUrl) {
          slides.push({
            imageUrl: stage.imageUrl,
            stageLabel: stage.label || null,
          });
        }
      }
    }
    return slides;
  };

  const carouselData = post ? buildCarousel() : [];
  const isCarousel = carouselData.length > 1;

  const handleCarouselScroll = useCallback(
    (e) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / screenWidth);
      setActiveIndex(index);
    },
    [screenWidth],
  );

  const renderImageCarousel = () => {
    const imgWidth = screenWidth;
    const imgHeight = Math.round(imgWidth / imageAspectRatio);

    if (!isCarousel) {
      return (
        <Image
          source={{ uri: post.imageUrl }}
          style={{ width: imgWidth, height: imgHeight, backgroundColor: COLORS.gray200 }}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={[styles.carouselContainer, { height: imgHeight }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate="fast"
          onScroll={handleCarouselScroll}
          scrollEventThrottle={16}
        >
          {carouselData.map((slide, idx) => (
            <View key={`detail-slide-${idx}`} style={{ width: imgWidth, height: imgHeight }}>
              <Image
                source={{ uri: slide.imageUrl }}
                style={{ width: imgWidth, height: imgHeight }}
                resizeMode="cover"
              />
              {slide.stageLabel && (
                <View style={styles.stageLabelOverlay}>
                  <Text style={styles.stageLabelText}>{slide.stageLabel}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        {/* Counter badge */}
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {activeIndex + 1}/{carouselData.length}
          </Text>
        </View>
        {/* Dot indicators */}
        <View style={styles.dotContainer}>
          {carouselData.map((_, idx) => (
            <View
              key={`dot-${idx}`}
              style={[
                styles.dot,
                idx === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!post || !currentUser) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={COLORS.textTertiary}
        />
        <Text style={styles.errorText}>Post not found</Text>
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {renderImageCarousel()}

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.authorSection}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Image
              source={{
                uri:
                  post.author?.profilePicture ||
                  "https://via.placeholder.com/50",
              }}
              style={styles.authorAvatar}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>
                {post.author?.name || "Artist"}
              </Text>
              <Text style={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>

          <Text style={styles.title}>{post.title}</Text>

          {post.description && (
            <Text style={styles.description}>{post.description}</Text>
          )}

          {post.medium && (
            <View style={styles.mediumContainer}>
              <Ionicons name="brush-outline" size={16} color={COLORS.primary} />
              <Text style={styles.mediumText}>{post.medium}</Text>
            </View>
          )}

          {post.tags && (
            <View style={styles.tagsContainer}>
              {post.tags.split(",").map((tag) => (
                <View key={tag.trim()} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag.trim()}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actionsBar}>
            <LikeButton
              postId={post.id}
              initialLiked={hasLiked}
              initialCount={post._count?.likes || 0}
              userId={currentUser?.id}
            />
            <View style={styles.commentIndicator}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={COLORS.textSecondary}
              />
              <Text style={styles.commentCount}>
                {post._count?.comments || 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.commentsWrapper}>
          <CommentSection
            postId={post.id}
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  shareButton: {
    padding: 8,
  },
  carouselContainer: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: COLORS.gray200,
  },
  stageLabelOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  stageLabelText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
  counterBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotInactive: {
    backgroundColor: COLORS.gray300,
  },
  content: {
    padding: 20,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray200,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  postDate: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  mediumContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  mediumText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  actionsBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
  },
  commentIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  commentCount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  commentsWrapper: {
    minHeight: 400,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    backgroundColor: COLORS.background,
  },
});

export default PostDetailScreen;
