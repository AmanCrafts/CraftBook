import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PostCard = ({ post, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image
                source={{ uri: post.imageUrl || 'https://via.placeholder.com/400' }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.artistInfo}>
                        <Image
                            source={{ uri: post.user?.profilePicture || 'https://via.placeholder.com/40' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.artistName}>{post.user?.name || 'Artist'}</Text>
                            <Text style={styles.medium}>{post.medium || 'Mixed Media'}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.title}>{post.title}</Text>
                {post.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {post.description}
                    </Text>
                )}

                <View style={styles.footer}>
                    <View style={styles.stats}>
                        <Text style={styles.statText}>Likes: {post._count?.likes || 0}</Text>
                        <Text style={styles.statText}>Comments: {post._count?.comments || 0}</Text>
                    </View>
                    <Text style={styles.timeAgo}>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginBottom: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 300,
        backgroundColor: '#f0f0f0',
    },
    content: {
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    artistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#e0e0e0',
    },
    artistName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    medium: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    stats: {
        flexDirection: 'row',
        gap: 15,
    },
    statText: {
        fontSize: 14,
        color: '#666',
    },
    timeAgo: {
        fontSize: 12,
        color: '#999',
    },
});

export default PostCard;
