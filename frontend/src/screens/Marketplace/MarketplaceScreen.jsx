import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import marketplaceAPI from "../../api/marketplace.api";
import COLORS from "../../constants/colors";
import ROUTES from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 12;
const NUM_COLUMNS = 2;
const TILE_WIDTH = (SCREEN_WIDTH - 32 - GRID_GAP) / NUM_COLUMNS;

const CATEGORIES = [
    "All",
    "Painting",
    "Digital Art",
    "Sculpture",
    "Photography",
    "Sketching",
    "Mixed Media",
];

const MarketplaceScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchListings = useCallback(async () => {
        try {
            setLoading(true);
            const filters = { status: "AVAILABLE", limit: 20, page: 1 };
            if (activeCategory !== "All") filters.category = activeCategory;

            let result;
            if (searchQuery.trim()) {
                const data = await marketplaceAPI.searchListings(searchQuery.trim());
                result = { listings: data, totalPages: 1 };
            } else {
                result = await marketplaceAPI.getListings(filters);
            }

            setListings(result.listings || []);
            setTotalPages(result.totalPages || 1);
            setPage(1);
        } catch (error) {
            console.error("Error fetching listings:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeCategory, searchQuery]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    // Refresh when screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchListings();
        });
        return unsubscribe;
    }, [navigation, fetchListings]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchListings();
    };

    const renderListingCard = ({ item }) => (
        <TouchableOpacity
            style={styles.listingCard}
            onPress={() => navigation.navigate(ROUTES.LISTING_DETAIL, { listingId: item.id })}
            activeOpacity={0.85}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.listingImage} />
            {item.status === "SOLD" && (
                <View style={styles.soldBadge}>
                    <Text style={styles.soldText}>SOLD</Text>
                </View>
            )}
            <View style={styles.listingInfo}>
                <Text style={styles.listingTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.listingPrice}>
                    ${item.price.toFixed(2)}
                </Text>
                <View style={styles.sellerRow}>
                    <Ionicons name="person-circle-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.sellerName} numberOfLines={1}>
                        {item.seller?.name || "Unknown"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <View>
            {/* Header */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Marketplace</Text>
                    <TouchableOpacity
                        style={styles.sellButton}
                        onPress={() => navigation.navigate(ROUTES.CREATE_LISTING)}
                    >
                        <Ionicons name="add-circle" size={20} color={COLORS.white} />
                        <Text style={styles.sellButtonText}>Sell</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={COLORS.textTertiary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search artworks..."
                    placeholderTextColor={COLORS.textTertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={fetchListings}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => { setSearchQuery(""); }}>
                        <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Categories */}
            <FlatList
                horizontal
                data={CATEGORIES}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.categoryChip,
                            activeCategory === item && styles.categoryChipActive,
                        ]}
                        onPress={() => setActiveCategory(item)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                activeCategory === item && styles.categoryTextActive,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                {renderHeader()}
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={listings}
                renderItem={renderListingCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="storefront-outline" size={64} color={COLORS.textTertiary} />
                        <Text style={styles.emptyTitle}>No artworks for sale</Text>
                        <Text style={styles.emptySubtitle}>Be the first to list your artwork!</Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate(ROUTES.CREATE_LISTING)}
                        >
                            <Text style={styles.emptyButtonText}>List Artwork</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.white,
    },
    sellButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    sellButtonText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginTop: -10,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    categoryTextActive: {
        color: COLORS.white,
    },
    listContent: {
        paddingBottom: 100,
    },
    row: {
        paddingHorizontal: 16,
        justifyContent: "space-between",
        marginBottom: GRID_GAP,
    },
    listingCard: {
        width: TILE_WIDTH,
        backgroundColor: COLORS.white,
        borderRadius: 14,
        overflow: "hidden",
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    listingImage: {
        width: "100%",
        height: TILE_WIDTH,
        backgroundColor: COLORS.backgroundTertiary,
    },
    soldBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: COLORS.error,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    soldText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "800",
    },
    listingInfo: {
        padding: 10,
    },
    listingTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 4,
    },
    listingPrice: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 6,
    },
    sellerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    sellerName: {
        fontSize: 12,
        color: COLORS.textSecondary,
        flex: 1,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 60,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 8,
        textAlign: "center",
    },
    emptyButton: {
        marginTop: 20,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },
    emptyButtonText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 15,
    },
});

export default MarketplaceScreen;
