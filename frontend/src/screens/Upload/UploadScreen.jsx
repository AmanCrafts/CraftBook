import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCropPicker from "../../components/common/ImageCropPicker";
import COLORS from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";

const UploadScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessPost, setIsProcessPost] = useState(false);
  const [processStages, setProcessStages] = useState([]);

  const STAGE_LABEL_OPTIONS = [
    "Concept / Reference",
    "Rough Sketch",
    "Line Art",
    "Base Colors",
    "Shading & Details",
    "Final Piece",
  ];

  const mediumOptions = [
    "Pencil",
    "Charcoal",
    "Watercolor",
    "Acrylic",
    "Oil Paint",
    "Digital",
    "Ink",
    "Mixed Media",
    "Other",
  ];

  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Missing Image", "Please select a main image to upload.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a title for your artwork.");
      return;
    }

    if (!medium) {
      Alert.alert("Missing Medium", "Please select the medium used.");
      return;
    }

    if (isProcessPost && processStages.length < 2) {
      Alert.alert(
        "Need More Stages",
        "A process post needs at least 2 stages to show your creative journey."
      );
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        Alert.alert("Error", "You must be logged in to upload.");
        setLoading(false);
        return;
      }

      const API_URL = process.env.EXPO_PUBLIC_API_URL;

      // Upload main image to Supabase via backend
      const formData = new FormData();
      const uriParts = image.split("/");
      const fileName = uriParts[uriParts.length - 1];
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: fileName,
      });

      const uploadResponse = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        Alert.alert("Error", uploadData.error || "Failed to upload image.");
        setLoading(false);
        return;
      }

      const imageUrl = uploadData.image.url;

      // Upload process stage images if it's a process post
      let uploadedStages = null;
      if (isProcessPost && processStages.length > 0) {
        uploadedStages = [];
        for (const stage of processStages) {
          const stageFormData = new FormData();
          const stageUriParts = stage.imageUri.split("/");
          const stageFileName = stageUriParts[stageUriParts.length - 1];
          stageFormData.append("image", {
            uri: stage.imageUri,
            type: "image/jpeg",
            name: stageFileName,
          });

          const stageUploadResponse = await fetch(`${API_URL}/api/upload`, {
            method: "POST",
            body: stageFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const stageUploadData = await stageUploadResponse.json();

          if (stageUploadResponse.ok) {
            uploadedStages.push({
              imageUrl: stageUploadData.image.url,
              label: stage.label,
              description: stage.description || "",
            });
          }
        }
      }

      // Create post with the uploaded image URL
      const postData = {
        authorId: user.id,
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl,
        medium: medium,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .join(","),
        isProcessPost: isProcessPost && uploadedStages && uploadedStages.length > 0,
        processStages: uploadedStages,
      };

      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Your artwork has been posted!", [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setImage(null);
              setTitle("");
              setDescription("");
              setMedium("");
              setTags("");
              setIsProcessPost(false);
              setProcessStages([]);
              navigation.navigate("Home");
            },
          },
        ]);
      } else {
        const errorMessage = data.details
          ? `${data.error}: ${data.details}`
          : data.error || "Failed to upload post.";
        Alert.alert("Error", errorMessage);
        console.error("Post creation error:", data);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Error",
        `An error occurred while uploading: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share Your Art</Text>
        <Text style={styles.headerSubtitle}>Upload your latest creation</Text>
      </View>

      <View style={styles.content}>
        {/* Image Picker with Crop */}
        <View style={styles.imageSection}>
          <ImageCropPicker onImageSelected={setImage} currentImage={image} />
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Give your artwork a title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about your artwork..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Medium *</Text>
          <View style={styles.mediumContainer}>
            {mediumOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.mediumChip,
                  medium === option && styles.mediumChipActive,
                ]}
                onPress={() => setMedium(option)}
              >
                <Text
                  style={[
                    styles.mediumChipText,
                    medium === option && styles.mediumChipTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="portrait, sketch, realism"
            value={tags}
            onChangeText={setTags}
          />

          {/* Process Post Toggle */}
          <View style={styles.processToggleContainer}>
            <View style={styles.processToggleLeft}>
              <Ionicons
                name="layers-outline"
                size={22}
                color={isProcessPost ? COLORS.accent : COLORS.textSecondary}
              />
              <View style={styles.processToggleTextContainer}>
                <Text style={styles.processToggleTitle}>Process Post</Text>
                <Text style={styles.processToggleSubtitle}>
                  Show your creative journey step by step
                </Text>
              </View>
            </View>
            <Switch
              value={isProcessPost}
              onValueChange={setIsProcessPost}
              trackColor={{
                false: COLORS.gray300,
                true: COLORS.accentLight,
              }}
              thumbColor={isProcessPost ? COLORS.accent : COLORS.gray400}
            />
          </View>

          {/* Process Stages */}
          {isProcessPost && (
            <View style={styles.processStagesSection}>
              <Text style={styles.processSectionTitle}>
                Add Stages ({processStages.length}/6)
              </Text>
              <Text style={styles.processSectionSubtitle}>
                Add images showing each step of your process (min 2)
              </Text>

              {/* Existing Stages */}
              {processStages.map((stage, index) => (
                <View key={`stage-${index}`} style={styles.stageItem}>
                  <Image
                    source={{ uri: stage.imageUri }}
                    style={styles.stageThumb}
                  />
                  <View style={styles.stageInfo}>
                    <Text style={styles.stageLabel} numberOfLines={1}>
                      {stage.label}
                    </Text>
                    {stage.description ? (
                      <Text
                        style={styles.stageDescription}
                        numberOfLines={1}
                      >
                        {stage.description}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.removeStageBtn}
                    onPress={() => {
                      setProcessStages((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color={COLORS.error}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add Stage Button */}
              {processStages.length < 6 && (
                <TouchableOpacity
                  style={styles.addStageButton}
                  onPress={async () => {
                    try {
                      const { status } =
                        await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== "granted") {
                        Alert.alert(
                          "Permission needed",
                          "Please grant gallery permissions."
                        );
                        return;
                      }

                      const result =
                        await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: true,
                          quality: 0.9,
                        });

                      if (!result.canceled && result.assets[0]) {
                        // Show label picker
                        const availableLabels = STAGE_LABEL_OPTIONS.filter(
                          (l) =>
                            !processStages.some((s) => s.label === l)
                        );
                        const defaultLabel =
                          availableLabels[0] ||
                          `Stage ${processStages.length + 1}`;

                        Alert.prompt
                          ? Alert.prompt(
                            "Stage Label",
                            "Enter a label for this stage:",
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Add",
                                onPress: (label) => {
                                  setProcessStages((prev) => [
                                    ...prev,
                                    {
                                      imageUri: result.assets[0].uri,
                                      label: label || defaultLabel,
                                      description: "",
                                    },
                                  ]);
                                },
                              },
                            ],
                            "plain-text",
                            defaultLabel
                          )
                          : setProcessStages((prev) => [
                            ...prev,
                            {
                              imageUri: result.assets[0].uri,
                              label: defaultLabel,
                              description: "",
                            },
                          ]);
                      }
                    } catch (error) {
                      console.error("Error picking stage image:", error);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={COLORS.accent}
                  />
                  <Text style={styles.addStageText}>Add Stage Image</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.uploadButton,
              loading && styles.uploadButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.uploadButtonText}>Post Artwork</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 30,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textTertiary,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  pickButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  pickButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  changeImageButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(244, 81, 30, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.gray100,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  mediumContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 5,
  },
  mediumChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  mediumChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mediumChipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  mediumChipTextActive: {
    color: COLORS.white,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  processToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  processToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  processToggleTextContainer: {
    flex: 1,
  },
  processToggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  processToggleSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  processStagesSection: {
    marginTop: 16,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  processSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  processSectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  stageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  stageThumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.gray200,
  },
  stageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  stageDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  removeStageBtn: {
    padding: 4,
  },
  addStageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.accentLight,
    borderStyle: "dashed",
    gap: 8,
  },
  addStageText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.accent,
  },
});

export default UploadScreen;
