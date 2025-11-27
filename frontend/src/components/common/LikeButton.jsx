import React, { useState, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { likeAPI } from "../../api/like.api";

const LikeButton = ({ postId, initialLiked = false, initialCount = 0, userId }) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = async () => {
        if (isLoading || !userId) return;

        // Store previous state for potential rollback
        const previousLiked = isLiked;
        const previousCount = likeCount;

        // Optimistic UI update
        const newLikedState = !isLiked;
        const newCount = newLikedState ? likeCount + 1 : likeCount - 1;

        setIsLiked(newLikedState);
        setLikeCount(newCount);

        // Animate
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();

        // Call API
        try {
            setIsLoading(true);
            await likeAPI.toggleLike(postId, userId);
        } catch (error) {
            // Revert on error
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
            console.error("Error toggling like:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={isLoading}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={24}
                    color={COLORS.likeIcon}
                />
            </Animated.View>
            <Text style={[styles.count, isLiked && styles.countLiked]}>
                {likeCount}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    count: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    countLiked: {
        color: COLORS.danger,
    },
});

export default LikeButton;
