import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        posts: 0,
        followers: 0,
        following: 0,
    });
    const auth = getAuth();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                navigation.replace('Login');
                return;
            }

            const API_URL = process.env.EXPO_PUBLIC_API_URL;

            const userResponse = await fetch(`${API_URL}/api/users/google/${currentUser.uid}`);
            const userData = await userResponse.json();

            if (userResponse.ok) {
                setUser(userData);

                const postsResponse = await fetch(`${API_URL}/api/posts/user/${userData.id}`);
                const postsData = await postsResponse.json();

                if (postsResponse.ok) {
                    setPosts(postsData);
                    setStats(prev => ({ ...prev, posts: postsData.length }));
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.replace('Login');
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'Failed to logout');
                        }
                    }
                }
            ]
        );
    };

    const handleEditProfile = () => {
        Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
    };

    const renderPostItem = ({ item }) => (
        <TouchableOpacity style={styles.postItem}>
            <Image
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                style={styles.postImage}
            />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f4511e" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User not found</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
                    <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: user.profilePicture || 'https://via.placeholder.com/100' }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user.name}</Text>
                {user.medium && (
                    <Text style={styles.medium}>{user.medium}</Text>
                )}
                {user.bio && (
                    <Text style={styles.bio}>{user.bio}</Text>
                )}

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.posts}</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.followers}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.following}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>

                {/* Edit Profile Button */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditProfile}
                >
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Posts Grid */}
            <View style={styles.postsSection}>
                <Text style={styles.sectionTitle}>Your Artwork</Text>
                {posts.length > 0 ? (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPostItem}
                        numColumns={3}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.postsRow}
                    />
                ) : (
                    <View style={styles.emptyPosts}>
                        <Text style={styles.emptyText}>No posts yet</Text>
                        <Text style={styles.emptySubtext}>
                            Share your first artwork!
                        </Text>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => navigation.navigate('Upload')}
                        >
                            <Text style={styles.uploadButtonText}>Upload Artwork</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#f4511e',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    logoutButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f4511e',
    },
    logoutButtonText: {
        color: '#f4511e',
        fontSize: 14,
        fontWeight: '600',
    },
    profileSection: {
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    medium: {
        fontSize: 16,
        color: '#f4511e',
        marginBottom: 10,
    },
    bio: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 15,
        width: '100%',
        justifyContent: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#e0e0e0',
    },
    editButton: {
        backgroundColor: '#f4511e',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    postsSection: {
        backgroundColor: '#fff',
        marginTop: 10,
        padding: 20,
        minHeight: 300,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    postsRow: {
        gap: 5,
    },
    postItem: {
        flex: 1,
        aspectRatio: 1,
        margin: 2,
    },
    postImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    emptyPosts: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    uploadButton: {
        backgroundColor: '#f4511e',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;
