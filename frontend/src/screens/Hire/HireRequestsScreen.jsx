import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import hireAPI from "../../api/hire.api";
import COLORS from "../../constants/colors";
import ROUTES from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_COLORS = {
    PENDING: COLORS.warning,
    ACCEPTED: COLORS.info,
    IN_PROGRESS: COLORS.accent,
    COMPLETED: COLORS.success,
    DECLINED: COLORS.error,
    CANCELLED: COLORS.textTertiary,
};

const STATUS_ICONS = {
    PENDING: "time-outline",
    ACCEPTED: "checkmark-circle-outline",
    IN_PROGRESS: "brush-outline",
    COMPLETED: "trophy-outline",
    DECLINED: "close-circle-outline",
    CANCELLED: "ban-outline",
};

const HireRequestsScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("sent");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            if (activeTab === "sent") {
                data = await hireAPI.getHireRequestsByClient(user.id);
            } else {
                data = await hireAPI.getHireRequestsByArtist(user.id);
            }
            setRequests(data || []);
        } catch (error) {
            console.error("Error fetching hire requests:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, user?.id]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchRequests);
        return unsubscribe;
    }, [navigation, fetchRequests]);

    const handleRespond = (request, action) => {
        const actionLabel = action === "accept" ? "Accept" : "Decline";

        Alert.alert(
            `${actionLabel} Request`,
            `Are you sure you want to ${action} "${request.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: actionLabel,
                    style: action === "decline" ? "destructive" : "default",
                    onPress: async () => {
                        try {
                            await hireAPI.respondToHireRequest(request.id, user.id, action);
                            fetchRequests();
                            Alert.alert("Done", `Request ${action === "accept" ? "accepted" : "declined"}.`);
                        } catch (error) {
                            Alert.alert("Error", error.details || error.message || "Could not update request");
                        }
                    },
                },
            ]
        );
    };

    const handleCancel = (request) => {
        Alert.alert("Cancel Request", "Are you sure you want to cancel this hire request?", [
            { text: "No", style: "cancel" },
            {
                text: "Cancel Request",
                style: "destructive",
                onPress: async () => {
                    try {
                        await hireAPI.cancelHireRequest(request.id, user.id);
                        fetchRequests();
                    } catch (error) {
                        Alert.alert("Error", error.details || error.message || "Could not cancel request");
                    }
                },
            },
        ]);
    };

    const handleMarkProgress = async (request, status) => {
        try {
            await hireAPI.updateHireRequestStatus(request.id, user.id, status);
            fetchRequests();
        } catch (error) {
            Alert.alert("Error", error.details || error.message || "Could not update status");
        }
    };

    const renderRequest = ({ item }) => {
        const isSent = activeTab === "sent";
        const otherPerson = isSent ? item.artist : item.client;

        return (
            <View style={styles.requestCard}>
                <View style={styles.requestHeader}>
                    <View style={styles.requestTitleRow}>
                        <Ionicons
                            name={STATUS_ICONS[item.status] || "help-outline"}
                            size={20}
                            color={STATUS_COLORS[item.status]}
                        />
                        <Text style={styles.requestTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                        <Text style={styles.statusText}>{item.status.replace("_", " ")}</Text>
                    </View>
                </View>

                <Text style={styles.requestDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.requestMeta}>
                    {item.budget && (
                        <View style={styles.metaItem}>
                            <Ionicons name="cash-outline" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.metaText}>${item.budget.toFixed(2)}</Text>
                        </View>
                    )}
                    {item.deadline && (
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.metaText}>
                                {new Date(item.deadline).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Other person */}
                <TouchableOpacity
                    style={styles.personRow}
                    onPress={() => navigation.navigate(ROUTES.USER_PROFILE, { userId: otherPerson?.id })}
                >
                    <Ionicons name="person-circle-outline" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.personName}>
                        {isSent ? "Artist" : "Client"}: {otherPerson?.name || "Unknown"}
                    </Text>
                </TouchableOpacity>

                {/* Artist response */}
                {item.response && (
                    <View style={styles.responseBox}>
                        <Text style={styles.responseLabel}>Artist's Response:</Text>
                        <Text style={styles.responseText}>{item.response}</Text>
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actionsRow}>
                    {/* Artist can accept/decline pending requests */}
                    {!isSent && item.status === "PENDING" && (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.acceptButton]}
                                onPress={() => handleRespond(item, "accept")}
                            >
                                <Ionicons name="checkmark" size={16} color={COLORS.white} />
                                <Text style={styles.actionButtonText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.declineButton]}
                                onPress={() => handleRespond(item, "decline")}
                            >
                                <Ionicons name="close" size={16} color={COLORS.white} />
                                <Text style={styles.actionButtonText}>Decline</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Artist can mark as in-progress */}
                    {!isSent && item.status === "ACCEPTED" && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.progressButton]}
                            onPress={() => handleMarkProgress(item, "IN_PROGRESS")}
                        >
                            <Ionicons name="brush" size={16} color={COLORS.white} />
                            <Text style={styles.actionButtonText}>Start Working</Text>
                        </TouchableOpacity>
                    )}

                    {/* Artist can mark as completed */}
                    {!isSent && item.status === "IN_PROGRESS" && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.completeButton]}
                            onPress={() => handleMarkProgress(item, "COMPLETED")}
                        >
                            <Ionicons name="trophy" size={16} color={COLORS.white} />
                            <Text style={styles.actionButtonText}>Mark Complete</Text>
                        </TouchableOpacity>
                    )}

                    {/* Client can cancel pending/accepted/in-progress */}
                    {isSent && ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(item.status) && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={() => handleCancel(item)}
                        >
                            <Ionicons name="close-circle-outline" size={16} color={COLORS.error} />
                            <Text style={[styles.actionButtonText, { color: COLORS.error }]}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hire Requests</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "sent" && styles.tabActive]}
                    onPress={() => setActiveTab("sent")}
                >
                    <Ionicons
                        name="paper-plane-outline"
                        size={18}
                        color={activeTab === "sent" ? COLORS.primary : COLORS.textTertiary}
                    />
                    <Text style={[styles.tabText, activeTab === "sent" && styles.tabTextActive]}>
                        Sent
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "received" && styles.tabActive]}
                    onPress={() => setActiveTab("received")}
                >
                    <Ionicons
                        name="mail-outline"
                        size={18}
                        color={activeTab === "received" ? COLORS.primary : COLORS.textTertiary}
                    />
                    <Text style={[styles.tabText, activeTab === "received" && styles.tabTextActive]}>
                        Received
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={requests}
                    renderItem={renderRequest}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="brush-outline" size={64} color={COLORS.textTertiary} />
                            <Text style={styles.emptyTitle}>
                                No {activeTab === "sent" ? "sent" : "received"} requests
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {activeTab === "sent"
                                    ? "Browse artists and send them commission requests!"
                                    : "When someone wants to hire you, their requests will appear here."}
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
    requestCard: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    requestHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    requestTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 8,
        marginRight: 10,
    },
    requestTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: "700",
    },
    requestDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
        marginBottom: 10,
    },
    requestMeta: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 10,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: "600",
    },
    personRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
    },
    personName: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    responseBox: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    responseLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 4,
    },
    responseText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    actionsRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.white,
    },
    acceptButton: {
        backgroundColor: COLORS.success,
    },
    declineButton: {
        backgroundColor: COLORS.error,
    },
    progressButton: {
        backgroundColor: COLORS.accent,
    },
    completeButton: {
        backgroundColor: COLORS.success,
    },
    cancelButton: {
        backgroundColor: COLORS.backgroundTertiary,
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

export default HireRequestsScreen;
