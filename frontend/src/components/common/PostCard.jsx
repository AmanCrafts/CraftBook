import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import COLORS from "../../constants/colors";
import FollowButton from "./FollowButton";
import LikeButton from "./LikeButton";

const DEFAULT_RATIO = 4 / 5; // fallback while loading
const MIN_RATIO = 1 / 2;    // tallest allowed (portrait)
const MAX_RATIO = 2 / 1;    // widest allowed (landscape)

const PostCard = ({
  post,
  onPress,
  onCommentPress,
  onProfilePress,
  userId,
  initialLiked,
  initialFollowing = false,
  onFollowChange,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(screenWidth);
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_RATIO);
  const isOwnPost = userId === post.author?.id;

  const carouselData = buildCarouselData(post);
  const isCarousel = carouselData.length > 1;

  // Fetch dimensions of the main image to determine aspect ratio
  useEffect(() => {
    const mainUrl = post.imageUrl;
    if (mainUrl) {
      Image.getSize(
        mainUrl,
        (w, h) => {
          if (w > 0 && h > 0) {
            const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, w / h));
            setAspectRatio(ratio);
          }
        },
        () => { }, // ignore errors, keep default
      );
    }
  }, [post.imageUrl]);

  const handleLayout = useCallback((e) => {
    const measured = e.nativeEvent.layout.width;
    if (measured > 0 && measured !== cardWidth) {
      setCardWidth(measured);
    }
  }, [cardWidth]);

  const handleScroll = useCallback(
    (e) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / cardWidth);
      setActiveIndex(index);
    },
    [cardWidth],
  );

  const imageHeight = Math.round(cardWidth / aspectRatio);

  return (
    <View style={styles.card} onLayout={handleLayout}>
      {/* Header */}
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
          <View style={styles.artistTextWrap}>
            <Text style={styles.artistName}>
              {post.author?.name || "Artist"}
            </Text>
            <Text style={styles.medium}>{post.medium || "Mixed Media"}</Text>
          </View>
        </TouchableOpacity>
        {!isOwnPost && (
          <FollowButton
            userId={post.author?.id}
            currentUserId={userId}
            initialIsFollowing={initialFollowing}
            onFollowChange={onFollowChange}
            size="small"
          />
        )}
      </View>

      {/* Image area */}
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {isCarousel ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {carouselData.map((slide, idx) => (
              <TouchableOpacity
                key={`slide-${idx}`}
                onPress={onPress}
                activeOpacity={0.9}
                style={{ width: cardWidth, height: imageHeight }}
              >
                <Image
                  source={{ uri: slide.imageUrl }}
                  style={{ width: cardWidth, height: imageHeight }}
                  resizeMode="cover"
                />
                {slide.stageLabel && (
                  <View style={styles.stageLabelOverlay}>
                    <Text style={styles.stageLabelText}>
                      {slide.stageLabel}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <Image
              source={{
                uri: post.imageUrl || "https://via.placeholder.com/400",
              }}
              style={{ width: cardWidth, height: imageHeight }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Counter badge */}
        {isCarousel && (
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {activeIndex + 1}/{carouselData.length}
            </Text>
          </View>
        )}
      </View>

      {/* Dot indicators */}
      {isCarousel && (
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
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Actions row */}
        <View style={styles.actionsRow}>
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
                size={22}
                color={COLORS.text}
              />
              <Text style={styles.actionText}>
                {post._count?.comments || 0}
              </Text>
            </TouchableOpacity>
          </View>
          {post.isProcessPost && (
            <View style={styles.processBadge}>
              <Ionicons name="layers" size={13} color={COLORS.accent} />
              <Text style={styles.processBadgeText}>Process</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{post.title}</Text>
        {post.description && (
          <Text style={styles.description} numberOfLines={2}>
            {post.description}
          </Text>
        )}

        <Text style={styles.timeAgo}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

/**
 * Build carousel slides from a post.
 * First slide = main image; subsequent slides = process stage images (up to 7).
 */
function buildCarouselData(post) {
  const slides = [
    {
      imageUrl: post.imageUrl || "https://via.placeholder.com/400",
      stageLabel: null,
    },
  ];

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
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginBottom: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  artistInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: COLORS.gray200,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  artistTextWrap: {
    flex: 1,
  },
  artistName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  medium: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  imageContainer: {
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
    fontSize: 12,
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
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  processBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  processBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.accent,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  timeAgo: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});

export default PostCard;
