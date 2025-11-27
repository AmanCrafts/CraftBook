import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import commentAPI from "../../api/comment.api";

const CommentSection = ({ postId, currentUserId, currentUserName }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await commentAPI.getComments(postId);
            setComments(data.comments || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;

        const commentText = newComment.trim();
        setNewComment("");

        try {
            setSending(true);
            const comment = await commentAPI.createComment(
                postId,
                commentText,
                currentUserId,
            );
            setComments([comment, ...comments]);
        } catch (error) {
            console.error("Error creating comment:", error);
            Alert.alert("Error", "Failed to post comment");
            setNewComment(commentText); // Restore text on error
        } finally {
            setSending(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await commentAPI.deleteComment(commentId, currentUserId);
                        setComments(comments.filter((c) => c.id !== commentId));
                    } catch (error) {
                        console.error("Error deleting comment:", error);
                        Alert.alert("Error", "Failed to delete comment");
                    }
                },
            },
        ]);
    };

    const renderComment = ({ item }) => {
        const isOwnComment = item.authorId === currentUserId;

        return (
            <View style={styles.commentItem}>
                <Image
                    source={{
                        uri: item.author?.profilePicture || "https://via.placeholder.com/40",
                    }}
                    style={styles.avatar}
                />
                <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                        <Text style={styles.authorName}>{item.author?.name || "User"}</Text>
                        <Text style={styles.commentTime}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                    <Text style={styles.commentText}>{item.content}</Text>
                </View>
                {isOwnComment && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteComment(item.id)}
                    >
                        <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.title}>
                    Comments {comments.length > 0 && `(${comments.length})`}
                </Text>
            </View>

            {comments.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="chatbubble-outline"
                        size={48}
                        color={COLORS.textTertiary}
                    />
                    <Text style={styles.emptyText}>No comments yet</Text>
                    <Text style={styles.emptySubtext}>Be the first to comment!</Text>
                </View>
            ) : (
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={renderComment}
                    contentContainerStyle={styles.commentsList}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    maxLength={500}
                    editable={!sending}
                />
                <TouchableOpacity
                    style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
                    onPress={handleSendComment}
                    disabled={!newComment.trim() || sending}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <Ionicons name="send" size={20} color={COLORS.white} />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    loadingContainer: {
        padding: 40,
        alignItems: "center",
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
    },
    commentsList: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    commentItem: {
        flexDirection: "row",
        marginBottom: 16,
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray200,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    authorName: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
    },
    commentTime: {
        fontSize: 12,
        color: COLORS.textTertiary,
    },
    commentText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    deleteButton: {
        padding: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        gap: 8,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textTertiary,
    },
    inputContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
        alignItems: "flex-end",
        gap: 12,
        backgroundColor: COLORS.white,
        minHeight: 68,
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 100,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.gray100,
        borderRadius: 20,
        fontSize: 15,
        color: COLORS.text,
        textAlignVertical: "center",
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

export default CommentSection;
