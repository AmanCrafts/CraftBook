import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import marketplaceAPI from "../../api/marketplace.api";
import COLORS from "../../constants/colors";
import ROUTES from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ListingDetailScreen = ({ route, navigation }) => {
    const { listingId } = route.params;
    const { user } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);

    const fetchListing = useCallback(async () => {
        try {
            setLoading(true);
            const data = await marketplaceAPI.getListingById(listingId);
            setListing(data);
        } catch (error) {
            console.error("Error fetching listing:", error);
            Alert.alert("Error", "Could not load listing details");
        } finally {
            setLoading(false);
        }
    }, [listingId]);

    useEffect(() => {
        fetchListing();
    }, [fetchListing]);

    const handleBuy = async () => {
        if (!user) {
            Alert.alert("Login Required", "Please log in to purchase artworks.");
            return;
        }

        Alert.alert(
            "Confirm Purchase",
            `Buy "${listing.title}" for $${listing.price.toFixed(2)}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Buy Now",
                    onPress: async () => {
                        try {
                            setBuying(true);
                            await marketplaceAPI.createOrder({
                                buyerId: user.id,
                                listingId: listing.id,
                            });
                            Alert.alert("Success!", "Your order has been placed.", [
                                { text: "OK", onPress: () => navigation.navigate(ROUTES.MY_ORDERS) },
                            ]);
                            fetchListing(); // Refresh to show SOLD status
                        } catch (error) {
                            Alert.alert("Error", error.details || error.message || "Could not place order");
                        } finally {
                            setBuying(false);
                        }
                    },
                },
            ]
        );
    };

    const handleHireArtist = () => {
        if (!user) {
            Alert.alert("Login Required", "Please log in to hire artists.");
            return;
        }
        navigation.navigate(ROUTES.CREATE_HIRE_REQUEST, {
            artistId: listing.sellerId,
            artistName: listing.seller?.name,
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!listing) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Listing not found</Text>
            </View>
        );
    }

    const isOwner = user?.id === listing.sellerId;
    const isAvailable = listing.status === "AVAILABLE";

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerBarTitle}>Artwork Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image */}
                <Image source={{ uri: listing.imageUrl }} style={styles.image} />

                {listing.status === "SOLD" && (
                    <View style={styles.soldOverlay}>
                        <Text style={styles.soldOverlayText}>SOLD</Text>
                    </View>
                )}

                {/* Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{listing.title}</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${listing.price.toFixed(2)}</Text>
                        <Text style={styles.currency}>{listing.currency}</Text>
                    </View>

                    {listing.category && (
                        <View style={styles.tagRow}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>{listing.category}</Text>
                            </View>
                            {listing.medium && (
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{listing.medium}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {listing.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{listing.description}</Text>
                        </View>
                    )}

                    {/* Seller Info */}
                    <TouchableOpacity
                        style={styles.sellerCard}
                        onPress={() =>
                            navigation.navigate(ROUTES.USER_PROFILE, { userId: listing.sellerId })
                        }
                    >
                        <View style={styles.sellerAvatar}>
                            {listing.seller?.profilePicture ? (
                                <Image
                                    source={{ uri: listing.seller.profilePicture }}
                                    style={styles.sellerAvatarImage}
                                />
                            ) : (
                                <Ionicons name="person" size={24} color={COLORS.textTertiary} />
                            )}
                        </View>
                        <View style={styles.sellerInfo}>
                            <Text style={styles.sellerName}>{listing.seller?.name || "Unknown"}</Text>
                            <Text style={styles.sellerLabel}>Artist</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            {!isOwner && (
                <View style={styles.bottomBar}>
                    {isAvailable ? (
                        <TouchableOpacity
                            style={styles.buyButton}
                            onPress={handleBuy}
                            disabled={buying}
                        >
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primaryDark]}
                                style={styles.buyButtonGradient}
                            >
                                {buying ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <>
                                        <Ionicons name="cart" size={20} color={COLORS.white} />
                                        <Text style={styles.buyButtonText}>
                                            Buy Now - ${listing.price.toFixed(2)}
                                        </Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.soldButton}>
                            <Text style={styles.soldButtonText}>Sold Out</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.hireButton} onPress={handleHireArtist}>
                        <Ionicons name="brush" size={20} color={COLORS.primary} />
                        <Text style={styles.hireButtonText}>Hire Artist</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 56,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerBarTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.text,
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.85,
        backgroundColor: COLORS.backgroundTertiary,
    },
    soldOverlay: {
        position: "absolute",
        top: 112,
        right: 16,
        backgroundColor: COLORS.error,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
    },
    soldOverlayText: {
        color: COLORS.white,
        fontWeight: "800",
        fontSize: 14,
    },
    detailsContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.text,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 12,
        gap: 6,
    },
    price: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.primary,
    },
    currency: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: "600",
    },
    tagRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        backgroundColor: COLORS.backgroundTertiary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    sellerCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.backgroundSecondary,
        padding: 16,
        borderRadius: 14,
        gap: 12,
    },
    sellerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.backgroundTertiary,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    sellerAvatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    sellerInfo: {
        flex: 1,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
    },
    sellerLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    bottomBar: {
        flexDirection: "row",
        padding: 16,
        paddingBottom: 34,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        gap: 10,
    },
    buyButton: {
        flex: 2,
        borderRadius: 12,
        overflow: "hidden",
    },
    buyButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        gap: 8,
    },
    buyButtonText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 15,
    },
    soldButton: {
        flex: 2,
        backgroundColor: COLORS.backgroundTertiary,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14,
    },
    soldButtonText: {
        color: COLORS.textTertiary,
        fontWeight: "700",
        fontSize: 15,
    },
    hireButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 14,
        gap: 6,
    },
    hireButtonText: {
        color: COLORS.primary,
        fontWeight: "700",
        fontSize: 14,
    },
});

export default ListingDetailScreen;
