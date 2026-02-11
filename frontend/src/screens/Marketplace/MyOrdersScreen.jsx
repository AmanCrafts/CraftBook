import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import marketplaceAPI from "../../api/marketplace.api";
import COLORS from "../../constants/colors";
import ROUTES from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_COLORS = {
    PENDING: COLORS.warning,
    CONFIRMED: COLORS.info,
    SHIPPED: COLORS.accent,
    DELIVERED: COLORS.success,
    CANCELLED: COLORS.error,
};

const MyOrdersScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("purchases");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            if (activeTab === "purchases") {
                data = await marketplaceAPI.getOrdersByBuyer(user.id);
            } else {
                data = await marketplaceAPI.getOrdersBySeller(user.id);
            }
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, user?.id]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const renderOrder = ({ item }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate(ROUTES.LISTING_DETAIL, { listingId: item.listingId || item.listing?.id })}
            activeOpacity={0.85}
        >
            <Image
                source={{ uri: item.listing?.imageUrl }}
                style={styles.orderImage}
            />
            <View style={styles.orderInfo}>
                <Text style={styles.orderTitle} numberOfLines={1}>
                    {item.listing?.title}
                </Text>
                <Text style={styles.orderPrice}>${item.total.toFixed(2)}</Text>
                <View style={styles.orderMeta}>
                    <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || COLORS.textTertiary }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    <Text style={styles.orderDate}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                {activeTab === "purchases" && item.listing?.seller && (
                    <Text style={styles.otherUser}>Seller: {item.listing.seller.name}</Text>
                )}
                {activeTab === "sales" && item.buyer && (
                    <Text style={styles.otherUser}>Buyer: {item.buyer.name}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "purchases" && styles.tabActive]}
                    onPress={() => setActiveTab("purchases")}
                >
                    <Ionicons
                        name="bag-handle-outline"
                        size={18}
                        color={activeTab === "purchases" ? COLORS.primary : COLORS.textTertiary}
                    />
                    <Text style={[styles.tabText, activeTab === "purchases" && styles.tabTextActive]}>
                        Purchases
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "sales" && styles.tabActive]}
                    onPress={() => setActiveTab("sales")}
                >
                    <Ionicons
                        name="cash-outline"
                        size={18}
                        color={activeTab === "sales" ? COLORS.primary : COLORS.textTertiary}
                    />
                    <Text style={[styles.tabText, activeTab === "sales" && styles.tabTextActive]}>
                        Sales
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name={activeTab === "purchases" ? "bag-outline" : "cash-outline"}
                                size={64}
                                color={COLORS.textTertiary}
                            />
                            <Text style={styles.emptyTitle}>
                                No {activeTab === "purchases" ? "purchases" : "sales"} yet
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {activeTab === "purchases"
                                    ? "Browse the marketplace to find artworks!"
                                    : "List your artworks for sale to start earning!"}
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
    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.text,
    },
    tabs: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingBottom: 0,
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
        gap: 6,
    },
    tabActive: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textTertiary,
    },
    tabTextActive: {
        color: COLORS.primary,
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    orderCard: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    orderImage: {
        width: 100,
        height: 100,
        backgroundColor: COLORS.backgroundTertiary,
    },
    orderInfo: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },
    orderTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 4,
    },
    orderPrice: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 6,
    },
    orderMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "700",
    },
    orderDate: {
        fontSize: 12,
        color: COLORS.textTertiary,
    },
    otherUser: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    emptyContainer: {
        alignItems: "center",
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
});

export default MyOrdersScreen;
