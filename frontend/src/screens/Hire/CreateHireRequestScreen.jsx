import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import hireAPI from "../../api/hire.api";
import COLORS from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";

const CreateHireRequestScreen = ({ route, navigation }) => {
    const { artistId, artistName } = route.params;
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert("Required", "Please enter a title for your commission");
            return;
        }
        if (!description.trim()) {
            Alert.alert("Required", "Please describe what you'd like the artist to create");
            return;
        }

        try {
            setSubmitting(true);
            await hireAPI.createHireRequest({
                title: title.trim(),
                description: description.trim(),
                budget: budget ? parseFloat(budget) : null,
                deadline: deadline || null,
                clientId: user.id,
                artistId,
            });

            Alert.alert(
                "Request Sent!",
                `Your hire request has been sent to ${artistName || "the artist"}.`,
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error("Error creating hire request:", error);
            Alert.alert("Error", error.details || error.message || "Could not send hire request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hire Artist</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Artist info */}
                    <View style={styles.artistBanner}>
                        <Ionicons name="brush" size={28} color={COLORS.primary} />
                        <View style={styles.artistBannerInfo}>
                            <Text style={styles.artistBannerLabel}>Hiring</Text>
                            <Text style={styles.artistBannerName}>{artistName || "Artist"}</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Commission Title *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="e.g., Portrait painting, Logo design"
                            placeholderTextColor={COLORS.textTertiary}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe what you'd like the artist to create. Include details about style, size, colors, subject matter..."
                            placeholderTextColor={COLORS.textTertiary}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Budget */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Budget (USD)</Text>
                        <View style={styles.priceInput}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                value={budget}
                                onChangeText={setBudget}
                                placeholder="Your budget (optional)"
                                placeholderTextColor={COLORS.textTertiary}
                                keyboardType="decimal-pad"
                            />
                        </View>
                    </View>

                    {/* Deadline */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Deadline</Text>
                        <TextInput
                            style={styles.input}
                            value={deadline}
                            onChangeText={setDeadline}
                            placeholder="e.g., 2026-03-15 (optional)"
                            placeholderTextColor={COLORS.textTertiary}
                        />
                        <Text style={styles.hint}>Format: YYYY-MM-DD</Text>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <>
                                <Ionicons name="send" size={18} color={COLORS.white} />
                                <Text style={styles.submitButtonText}>Send Hire Request</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    artistBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primaryLighter + "20",
        padding: 16,
        borderRadius: 14,
        marginBottom: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: COLORS.primaryLighter,
    },
    artistBannerInfo: {
        flex: 1,
    },
    artistBannerLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: "600",
    },
    artistBannerName: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
        marginTop: 2,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.backgroundSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: COLORS.text,
    },
    textArea: {
        height: 140,
        paddingTop: 12,
    },
    priceInput: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.backgroundSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingLeft: 16,
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
        marginRight: 4,
    },
    hint: {
        fontSize: 12,
        color: COLORS.textTertiary,
        marginTop: 6,
    },
    submitButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },
});

export default CreateHireRequestScreen;
