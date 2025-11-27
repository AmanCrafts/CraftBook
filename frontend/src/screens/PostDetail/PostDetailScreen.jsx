import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import COLORS from "../../constants/colors";
import LikeButton from "../../components/common/LikeButton";
import CommentSection from "../../components/common/CommentSection";
import postAPI from "../../api/post.api";
import userAPI from "../../api/user.api";
import likeAPI from "../../api/like.api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PostDetailScreen = ({ route, navigation }) => {
    const { postId } = route.params;
    const [post, setPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [hasLiked, setHasLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        loadData();
    }, [postId]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Get current user
            const firebaseUser = auth.currentUser;
            if (firebaseUser) {
                const userData = await userAPI.getUserByGoogleId(firebaseUser.uid);
                setCurrentUser(userData);

                // Get post
                const postData = await postAPI.getPostById(postId);
                setPost(postData);

                // Check if user has liked the post
                const likeStatus = await likeAPI.checkUserLike(postId, firebaseUser.uid);
                setHasLiked(likeStatus);
            }
        } catch (error) {
            console.error("Error loading post:", error);
            Alert.alert("Error", "Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        Alert.alert("Share", "Share functionality coming soon!");
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
                <Ionicons name="alert-circle-outline" size={64} color={COLORS.textTertiary} />
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
                nestedScrollEnabled={true}
            >
                <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.postImage}
                    resizeMode="cover"
                />

                <View style={styles.content}>
                    <View style={styles.authorSection}>
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
                    </View>

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
                            {post.tags.split(",").map((tag, index) => (
                                <View key={index} style={styles.tag}>
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
                            userId={auth.currentUser?.uid}
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
            </ScrollView>

            <View style={styles.commentsContainer}>
                <CommentSection
                    postId={post.id}
                    currentUserId={currentUser.id}
                    currentUserName={currentUser.name}
                />
            </View>
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
    postImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        backgroundColor: COLORS.gray200,
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
    commentsContainer: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
        backgroundColor: COLORS.background,
    },
});

export default PostDetailScreen;
