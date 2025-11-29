import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import COLORS from "../../constants/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ASPECT_RATIOS = [
    { label: "4:3", value: [4, 3], icon: "tablet-landscape" },
    { label: "3:4", value: [3, 4], icon: "tablet-portrait" },
    { label: "1:1", value: [1, 1], icon: "square" },
    { label: "Original", value: null, icon: "image" },
];

const ImageCropPicker = ({ onImageSelected, currentImage }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
    const [imageInfo, setImageInfo] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (currentImage) {
            setSelectedImage(currentImage);
        }
    }, [currentImage]);

    const pickImage = async (source = "library") => {
        try {
            let result;

            if (source === "library") {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert(
                        "Permission needed",
                        "Please grant camera roll permissions to upload images.",
                    );
                    return;
                }

                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                    quality: 1,
                });
            } else {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert(
                        "Permission needed",
                        "Please grant camera permissions to take photos.",
                    );
                    return;
                }

                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: false,
                    quality: 1,
                });
            }

            if (!result.canceled && result.assets[0]) {
                const image = result.assets[0];
                setSelectedImage(image.uri);
                setImageInfo({
                    width: image.width,
                    height: image.height,
                    uri: image.uri,
                });
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const applyCrop = async () => {
        if (!selectedImage || !imageInfo) return;

        setProcessing(true);

        try {
            const manipulateOptions = [];

            if (selectedRatio.value) {
                // Calculate crop dimensions based on aspect ratio
                const [aspectWidth, aspectHeight] = selectedRatio.value;
                const imageAspect = imageInfo.width / imageInfo.height;
                const targetAspect = aspectWidth / aspectHeight;

                let cropWidth, cropHeight, originX, originY;

                if (imageAspect > targetAspect) {
                    // Image is wider than target aspect
                    cropHeight = imageInfo.height;
                    cropWidth = cropHeight * targetAspect;
                    originX = (imageInfo.width - cropWidth) / 2;
                    originY = 0;
                } else {
                    // Image is taller than target aspect
                    cropWidth = imageInfo.width;
                    cropHeight = cropWidth / targetAspect;
                    originX = 0;
                    originY = (imageInfo.height - cropHeight) / 2;
                }

                manipulateOptions.push({
                    crop: {
                        originX,
                        originY,
                        width: cropWidth,
                        height: cropHeight,
                    },
                });
            }

            // Resize to fit screen width while maintaining aspect ratio
            const maxWidth = SCREEN_WIDTH * 2; // 2x for better quality
            manipulateOptions.push({
                resize: { width: maxWidth },
            });

            const manipulatedImage = await manipulateAsync(
                imageInfo.uri,
                manipulateOptions,
                { compress: 0.9, format: SaveFormat.JPEG },
            ); onImageSelected(manipulatedImage.uri);
            setShowModal(false);
        } catch (error) {
            console.error("Error cropping image:", error);
            Alert.alert("Error", "Failed to process image");
        } finally {
            setProcessing(false);
        }
    };

    const getPreviewDimensions = () => {
        if (!imageInfo || !selectedRatio.value) {
            // Original aspect ratio
            const maxHeight = SCREEN_HEIGHT * 0.5;
            const maxWidth = SCREEN_WIDTH * 0.9;

            if (imageInfo) {
                const imageAspect = imageInfo.width / imageInfo.height;
                if (imageAspect > maxWidth / maxHeight) {
                    return { width: maxWidth, height: maxWidth / imageAspect };
                } else {
                    return { width: maxHeight * imageAspect, height: maxHeight };
                }
            }

            return { width: maxWidth, height: maxHeight };
        }

        const [aspectWidth, aspectHeight] = selectedRatio.value;
        const containerWidth = SCREEN_WIDTH * 0.9;
        const targetAspect = aspectWidth / aspectHeight;

        const width = containerWidth;
        const height = width / targetAspect;

        return { width, height };
    };

    return (
        <View>
            {selectedImage ? (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.preview} />
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => pickImage("library")}
                    >
                        <Ionicons name="create-outline" size={20} color={COLORS.white} />
                        <Text style={styles.changeButtonText}>Change</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.placeholderContainer}>
                    <View style={styles.placeholder}>
                        <Ionicons name="image-outline" size={64} color={COLORS.textTertiary} />
                        <Text style={styles.placeholderText}>No image selected</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.pickButton}
                                onPress={() => pickImage("library")}
                            >
                                <Ionicons name="images-outline" size={20} color={COLORS.white} />
                                <Text style={styles.pickButtonText}>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pickButton}
                                onPress={() => pickImage("camera")}
                            >
                                <Ionicons name="camera-outline" size={20} color={COLORS.white} />
                                <Text style={styles.pickButtonText}>Camera</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <Modal
                visible={showModal}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() => setShowModal(false)}
                            style={styles.modalButton}
                        >
                            <Ionicons name="close" size={28} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Crop Image</Text>
                        <TouchableOpacity
                            onPress={applyCrop}
                            style={styles.modalButton}
                            disabled={processing}
                        >
                            <Text
                                style={[
                                    styles.doneText,
                                    processing && styles.doneTextDisabled,
                                ]}
                            >
                                {processing ? "Processing..." : "Done"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ratioSelector}>
                        {ASPECT_RATIOS.map((ratio) => (
                            <TouchableOpacity
                                key={ratio.label}
                                style={[
                                    styles.ratioButton,
                                    selectedRatio.label === ratio.label &&
                                    styles.ratioButtonActive,
                                ]}
                                onPress={() => setSelectedRatio(ratio)}
                            >
                                <Ionicons
                                    name={ratio.icon}
                                    size={24}
                                    color={
                                        selectedRatio.label === ratio.label
                                            ? COLORS.primary
                                            : COLORS.textSecondary
                                    }
                                />
                                <Text
                                    style={[
                                        styles.ratioText,
                                        selectedRatio.label === ratio.label &&
                                        styles.ratioTextActive,
                                    ]}
                                >
                                    {ratio.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.imageContainer}>
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={[styles.modalImage, getPreviewDimensions()]}
                                resizeMode="cover"
                            />
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            {selectedRatio.label === "Original"
                                ? "Original aspect ratio will fit screen width perfectly"
                                : `Image will be cropped to ${selectedRatio.label} aspect ratio`}
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: COLORS.gray200,
    },
    preview: {
        width: "100%",
        height: 300,
    },
    changeButton: {
        position: "absolute",
        bottom: 16,
        right: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 6,
    },
    changeButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "600",
    },
    placeholderContainer: {
        marginBottom: 20,
    },
    placeholder: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 40,
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.gray300,
        borderStyle: "dashed",
    },
    placeholderText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: 16,
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
    },
    pickButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        gap: 8,
    },
    pickButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    modalButton: {
        padding: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
    },
    doneText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.primary,
    },
    doneTextDisabled: {
        opacity: 0.5,
    },
    ratioSelector: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray200,
    },
    ratioButton: {
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: 70,
    },
    ratioButtonActive: {
        backgroundColor: COLORS.backgroundSecondary,
    },
    ratioText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 6,
        fontWeight: "500",
    },
    ratioTextActive: {
        color: COLORS.primary,
        fontWeight: "600",
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalImage: {
        borderRadius: 8,
    },
    infoContainer: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray200,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: 20,
    },
});

export default ImageCropPicker;
