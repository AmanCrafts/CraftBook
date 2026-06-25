import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import marketplaceAPI from "../../api/marketplace.api";
import uploadAPI from "../../api/upload.api";
import COLORS from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";

const CATEGORIES = [
    "Painting",
    "Digital Art",
    "Sculpture",
    "Photography",
    "Sketching",
    "Watercolor",
    "Mixed Media",
    "Calligraphy",
];

const CreateListingScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [medium, setMedium] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert("Required", "Please enter a title");
            return;
        }
        if (!price || parseFloat(price) <= 0) {
            Alert.alert("Required", "Please enter a valid price");
            return;
        }
        if (!imageUri) {
            Alert.alert("Required", "Please select an image of your artwork");
            return;
        }

        try {
            setUploading(true);

            // Upload image first
            const uploadResult = await uploadAPI.uploadImage(imageUri);
            const imageUrl = uploadResult.image?.url;
            if (!imageUrl) {
                throw new Error("Failed to get image URL from upload");
            }

            // Create listing
            await marketplaceAPI.createListing({
                title: title.trim(),
                description: description.trim(),
                price: parseFloat(price),
                category: category || null,
                medium: medium.trim() || null,
                imageUrl,
                sellerId: user.id,
            });

            Alert.alert("Success!", "Your artwork has been listed for sale.", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error("Error creating listing:", error);
            Alert.alert("Error", error.details || error.message || "Could not create listing");
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sell Artwork</Text>
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
                    {/* Image Picker */}
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.imagePickerPlaceholder}>
                                <Ionicons name="camera-outline" size={40} color={COLORS.textTertiary} />
                                <Text style={styles.imagePickerText}>Add Artwork Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Title */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Name your artwork"
                            placeholderTextColor={COLORS.textTertiary}
                        />
                    </View>

                    {/* Price */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Price (USD) *</Text>
                        <View style={styles.priceInput}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                value={price}
                                onChangeText={setPrice}
                                placeholder="0.00"
                                placeholderTextColor={COLORS.textTertiary}
                                keyboardType="decimal-pad"
                            />
                        </View>
                    </View>

                    {/* Category */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.chipContainer}
                        >
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.chip,
                                        category === cat && styles.chipActive,
                                    ]}
                                    onPress={() => setCategory(category === cat ? "" : cat)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            category === cat && styles.chipTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Medium */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Medium</Text>
                        <TextInput
                            style={styles.input}
                            value={medium}
                            onChangeText={setMedium}
                            placeholder="e.g., Acrylic on canvas, Digital"
                            placeholderTextColor={COLORS.textTertiary}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Tell buyers about your artwork..."
                            placeholderTextColor={COLORS.textTertiary}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <>
                                <Ionicons name="pricetag" size={20} color={COLORS.white} />
                                <Text style={styles.submitButtonText}>List for Sale</Text>
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
    imagePicker: {
        width: "100%",
        height: 220,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 24,
        backgroundColor: COLORS.backgroundTertiary,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: "dashed",
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    imagePickerPlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    imagePickerText: {
        fontSize: 15,
        color: COLORS.textTertiary,
        fontWeight: "600",
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
        height: 100,
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
    chipContainer: {
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    chipTextActive: {
        color: COLORS.white,
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

export default CreateListingScreen;
