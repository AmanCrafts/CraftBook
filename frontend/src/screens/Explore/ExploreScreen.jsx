import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { likeAPI } from "../../api/like.api";
import postAPI from "../../api/post.api";
import COLORS from "../../constants/colors";
import ROUTES from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 10;
const NUM_COLUMNS = 2;
const TILE_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / NUM_COLUMNS;

// Default mediums shown when the API doesn't return any
const DEFAULT_MEDIUMS = [
    "Painting",
    "Sketching",
    "Digital Art",
    "Watercolor",
    "Oil Painting",
    "Charcoal",
    "Sculpture",
    "Photography",
    "Mixed Media",
    "Calligraphy",
];

const ExploreScreen = ({ navigation }) => {
    const { user } = useAuth();
    const currentUserId = user?.id;

    const [searchQuery, setSearchQuery] = useState("");
    const [activeMedium, setActiveMedium] = useState(null);
    const [mediums, setMediums] = useState(DEFAULT_MEDIUMS);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searching, setSearching] = useState(false);
    const [likedPosts, setLikedPosts] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    const searchTimeoutRef = useRef(null);

    // Fetch available mediums from backend
    useEffect(() => {
        const fetchMediums = async () => {
            try {
                const data = await postAPI.getDistinctMediums();
                if (Array.isArray(data) && data.length > 0) {
                    setMediums(data);
                }
            } catch (error) {
                console.error("Error fetching mediums:", error);
                // Keep default mediums
            }
        };
        fetchMediums();
    }, []);

    // Fetch posts based on current search/filter state
    const fetchPosts = useCallback(
        async (isLoadMore = false) => {
            if (isLoadMore && !hasMore) return;
            if (isLoadMore && loadingMore) return;

            const currentPage = isLoadMore ? page : 1;

            if (isLoadMore) {
                setLoadingMore(true);
            } else if (!refreshing) {
                setSearching(true);
            }

            try {
                const result = await postAPI.searchPosts({
                    query: searchQuery.trim(),
                    medium: activeMedium,
                    limit: 20,
                    page: currentPage,
                });

                const newPosts = result.posts || [];

                if (isLoadMore) {
                    setPosts((prev) => [...prev, ...newPosts]);
                } else {
                    setPosts(newPosts);
                }

                setHasMore(result.hasMore || false);
                setTotalResults(result.total || 0);
                setPage(isLoadMore ? currentPage + 1 : 2);

                // Check like statuses
                if (currentUserId && newPosts.length > 0) {
                    const likeStatuses = {};
                    await Promise.all(
                        newPosts.map(async (post) => {
                            try {
                                const liked = await likeAPI.checkUserLike(
                                    post.id,
                                    currentUserId
                                );
                                likeStatuses[post.id] = liked;
                            } catch {
                                likeStatuses[post.id] = false;
                            }
                        })
                    );

                    if (isLoadMore) {
                        setLikedPosts((prev) => ({ ...prev, ...likeStatuses }));
                    } else {
                        setLikedPosts(likeStatuses);
                    }
                }
            } catch (error) {
                console.error("Error searching posts:", error);
            } finally {
                setLoading(false);
                setRefreshing(false);
                setSearching(false);
                setLoadingMore(false);
            }
        },
        [searchQuery, activeMedium, currentUserId, hasMore, loadingMore, page, refreshing]
    );

    // Initial load and when filter/search changes
    useEffect(() => {
        setLoading(true);
        setPage(1);
        setHasMore(true);
        fetchPosts(false);
    }, [searchQuery, activeMedium]); // eslint-disable-line react-hooks/exhaustive-deps

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchPosts(false);
    };

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            fetchPosts(true);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        // Debounce search - clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        // No need to set timeout since useEffect handles it
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleMediumPress = (medium) => {
        setActiveMedium((prev) => (prev === medium ? null : medium));
    };

    const handlePostPress = (post) => {
        navigation.navigate("PostDetail", { postId: post.id });
    };

    const handleProfilePress = (userId) => {
        if (userId) {
            navigation.navigate(ROUTES.USER_PROFILE, { userId });
        }
    };

    const renderMediumChip = (medium) => {
        const isActive = activeMedium === medium;
        return (
            <TouchableOpacity
                key={medium}
                style={[styles.mediumChip, isActive && styles.mediumChipActive]}
                onPress={() => handleMediumPress(medium)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.mediumChipText,
                        isActive && styles.mediumChipTextActive,
                    ]}
                >
                    {medium}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderGridItem = ({ item }) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handlePostPress(item)}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: item.imageUrl || "https://via.placeholder.com/200" }}
                style={styles.gridImage}
                resizeMode="cover"
            />
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.gridOverlay}
            >
                <Text style={styles.gridTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <TouchableOpacity
                    style={styles.gridArtist}
                    onPress={() => handleProfilePress(item.author?.id)}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{
                            uri:
                                item.author?.profilePicture ||
                                "https://via.placeholder.com/24",
                        }}
                        style={styles.gridAvatar}
                    />
                    <Text style={styles.gridArtistName} numberOfLines={1}>
                        {item.author?.name || "Artist"}
                    </Text>
                </TouchableOpacity>
                <View style={styles.gridStats}>
                    <View style={styles.gridStat}>
                        <Ionicons
                            name={likedPosts[item.id] ? "heart" : "heart-outline"}
                            size={14}
                            color={likedPosts[item.id] ? COLORS.likeIcon : COLORS.white}
                        />
                        <Text style={styles.gridStatText}>
                            {item._count?.likes || 0}
                        </Text>
                    </View>
                    <View style={styles.gridStat}>
                        <Ionicons
                            name="chatbubble-outline"
                            size={13}
                            color={COLORS.white}
                        />
                        <Text style={styles.gridStatText}>
                            {item._count?.comments || 0}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
            {item.medium && (
                <View style={styles.gridMediumBadge}>
                    <Text style={styles.gridMediumText}>{item.medium}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[COLORS.accent, COLORS.primaryDark]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <Ionicons name="compass" size={28} color={COLORS.white} />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Explore</Text>
                            <Text style={styles.headerSubtitle}>
                                Discover art by medium & tags
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons
                            name="search"
                            size={20}
                            color={COLORS.textSecondary}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by title, tags, or description..."
                            placeholderTextColor={COLORS.textTertiary}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            returnKeyType="search"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={clearSearch}
                                style={styles.clearButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color={COLORS.textTertiary}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </LinearGradient>

            {/* Medium Filter Chips */}
            <View style={styles.mediumContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.mediumScrollContent}
                >
                    {mediums.map(renderMediumChip)}
                </ScrollView>
            </View>

            {/* Results Info */}
            {(searchQuery || activeMedium) && !loading && (
                <View style={styles.resultsInfo}>
                    <Text style={styles.resultsText}>
                        {totalResults} {totalResults === 1 ? "result" : "results"}
                        {searchQuery ? ` for "${searchQuery}"` : ""}
                        {activeMedium ? ` in ${activeMedium}` : ""}
                    </Text>
                    {(searchQuery || activeMedium) && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery("");
                                setActiveMedium(null);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.clearFilters}>Clear all</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Loading */}
            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Discovering artwork...</Text>
                </View>
            ) : (
                /* Results Grid */
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderGridItem}
                    numColumns={NUM_COLUMNS}
                    columnWrapperStyle={styles.gridRow}
                    contentContainerStyle={styles.gridContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? (
                            <View style={styles.loadingMoreContainer}>
                                <ActivityIndicator size="small" color={COLORS.primary} />
                                <Text style={styles.loadingMoreText}>Loading more...</Text>
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="search-outline"
                                size={64}
                                color={COLORS.gray400}
                            />
                            <Text style={styles.emptyTitle}>
                                {searchQuery || activeMedium
                                    ? "No artwork found"
                                    : "Start exploring"}
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery || activeMedium
                                    ? "Try different keywords or filters"
                                    : "Search for artwork or filter by medium"}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
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
    searchContainer: {
        marginTop: 4,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 46,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
        paddingVertical: 0,
    },
    clearButton: {
        padding: 4,
    },
    mediumContainer: {
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    mediumScrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    mediumChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    mediumChipActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    mediumChipText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    mediumChipTextActive: {
        color: COLORS.white,
    },
    resultsInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    resultsText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: "500",
        flex: 1,
    },
    clearFilters: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: "600",
        marginLeft: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    gridContent: {
        padding: 16,
        paddingBottom: 100,
    },
    gridRow: {
        justifyContent: "space-between",
    },
    gridItem: {
        width: TILE_WIDTH,
        height: TILE_WIDTH * 1.3,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: GRID_GAP,
        backgroundColor: COLORS.gray200,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    gridImage: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    gridOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 40,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.white,
        marginBottom: 4,
    },
    gridArtist: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    gridAvatar: {
        width: 18,
        height: 18,
        borderRadius: 9,
        marginRight: 6,
        backgroundColor: COLORS.gray400,
    },
    gridArtistName: {
        fontSize: 11,
        color: COLORS.white,
        opacity: 0.9,
        flex: 1,
    },
    gridStats: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    gridStat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    gridStatText: {
        fontSize: 11,
        color: COLORS.white,
        opacity: 0.9,
    },
    gridMediumBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "rgba(139, 92, 246, 0.85)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    gridMediumText: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.white,
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
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: 20,
    },
    loadingMoreContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        gap: 10,
    },
    loadingMoreText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});

export default ExploreScreen;
